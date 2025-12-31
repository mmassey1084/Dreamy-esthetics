import express from "express";
import { pool } from "../db/pool.js";
import { bookingSchema } from "../src/validation/bookingSchema.js";

const router = express.Router();

function toSqlDateTime(dateStr, timeStr) {
  // "2025-12-29" + "08:50" -> "2025-12-29 08:50:00"
  return `${dateStr} ${timeStr}:00`;
}

// POST /api/booking
router.post("/", async (req, res) => {
  console.log("Incoming booking data:", req.body);

  const parsed = bookingSchema.safeParse(req.body);
  if (!parsed.success) {
    console.log("Validation error:", parsed.error.flatten());
    return res.status(400).json({ message: "Validation failed.", errors: parsed.error.flatten() });
  }

  const data = parsed.data;
  console.log("Validated booking:", data);

  const slotStart = toSqlDateTime(data.date, data.time);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Look up service from DB 
    const [svcRows] = await conn.execute(
      `SELECT id, service_group, name, duration_minutes, price_cents
       FROM services
       WHERE id = ? AND is_active = 1
       LIMIT 1`,
      [data.serviceId]
    );

    if (svcRows.length === 0) {
      await conn.rollback();
      return res.status(400).json({ message: "Selected service not found." });
    }

    const svc = svcRows[0];

    // 2) Compute slot_end
    const [[endRow]] = await conn.execute(
      `SELECT DATE_ADD(?, INTERVAL ? MINUTE) AS slot_end`,
      [slotStart, svc.duration_minutes]
    );

    const slotEnd = endRow.slot_end; // string datetime

    // 3) Overlap check (blocks any overlaps)
    const [conflicts] = await conn.execute(
      `SELECT id, slot_start, slot_end
       FROM bookings
       WHERE status IN ('pending','confirmed')
         AND ? < slot_end
         AND ? > slot_start
       LIMIT 1`,
      [slotStart, slotEnd]
    );

    if (conflicts.length > 0) {
      await conn.rollback();
      return res.status(409).json({
        message: "That date/time is already taken. Please pick another slot.",
        conflict: conflicts[0],
      });
    }

    // 4) Find or create customer
    let customerId = null;
    const [custRows] = await conn.execute(
      `SELECT id FROM customers WHERE email = ? LIMIT 1`,
      [data.email.trim()]
    );

    if (custRows.length > 0) {
      customerId = custRows[0].id;

      //keep customer info updated
      await conn.execute(
        `UPDATE customers SET full_name = ?, phone = ? WHERE id = ?`,
        [data.fullName.trim(), data.phone.trim(), customerId]
      );
    } else {
      const [custIns] = await conn.execute(
        `INSERT INTO customers (full_name, email, phone) VALUES (?,?,?)`,
        [data.fullName.trim(), data.email.trim(), data.phone.trim()]
      );
      customerId = custIns.insertId;
    }

    // 5) Insert booking with snapshots 
    const [bookingIns] = await conn.execute(
      `INSERT INTO bookings
        (customer_id, service_id, service_group_snapshot, service_name_snapshot,
         duration_minutes, price_cents_snapshot, slot_start, slot_end, notes, status)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        customerId,
        svc.id,
        svc.service_group,
        svc.name,
        svc.duration_minutes,
        svc.price_cents,
        slotStart,
        slotEnd,
        (data.notes || "").trim(),
        "pending",
      ]
    );

    const bookingId = bookingIns.insertId;

    // 6) Insert cart items 
    for (const it of data.cartItems) {
      const priceCents = Math.round(Number(it.price) * 100);
      await conn.execute(
        `INSERT INTO booking_items (booking_id, item_group, item_name, price_cents, qty)
         VALUES (?,?,?,?,?)`,
        [bookingId, it.group, it.name, priceCents, it.qty]
      );
    }

    await conn.commit();

    return res.status(200).json({
      ok: true,
      bookingId,
      slotStart,
      slotEnd,
      service: {
        id: Number(svc.id),
        group: svc.service_group,
        name: svc.name,
        durationMinutes: Number(svc.duration_minutes),
        price: Number(svc.price_cents) / 100,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error("POST /api/booking failed:", err);
    return res.status(500).json({ message: "Server error creating booking." });
  } finally {
    conn.release();
  }
});

export default router;
