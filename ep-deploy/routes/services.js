import express from "express";
import { pool } from "../db/pool.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id,
              service_group AS \`group\`,
              name,
              duration_minutes AS duration,
              price_cents
       FROM services
       WHERE is_active = 1
       ORDER BY service_group, name`
    );

    const services = rows.map((r) => ({
      id: Number(r.id),
      group: r.group,
      name: r.name,
      duration: Number(r.duration),
      price: Number(r.price_cents) / 100,
    }));

    return res.json({ services });
  } catch (err) {
  console.error("GET /api/services failed:", err);
  return res.status(500).json({
    message: "Failed to load services.",
    error: err?.code || err?.message || String(err),
  });
}
});

export default router;
