import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// demo in-memory (resets whenever server restarts)
const orders = [];

router.post(
  "/",
  [
    body("customer.fullName")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Full name is required."),
    body("customer.email").trim().isEmail().withMessage("Valid email is required."),
    body("customer.phone")
      .trim()
      .matches(/^\+?[0-9()\-\s]{7,}$/)
      .withMessage("Valid phone is required."),

    body("items").isArray({ min: 1 }).withMessage("Cart must include at least one item."),
    body("items.*.name").trim().isLength({ min: 2, max: 140 }).withMessage("Item name required."),
    body("items.*.group").trim().isLength({ min: 2, max: 40 }).withMessage("Item group required."),
    body("items.*.price").isNumeric().withMessage("Item price required."),
    body("items.*.qty").isInt({ min: 1, max: 20 }).withMessage("Item qty required."),

    body("notes").optional({ nullable: true }).isLength({ max: 800 }).withMessage("Notes too long."),
  ],
  (req, res) => {
    console.log("Incoming checkout:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Checkout validation failed:", errors.array());
      return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
    }

    const orderId = String(Date.now()).slice(-8);

    const subtotal = req.body.items.reduce((sum, it) => {
      const price = Number(it.price);
      const qty = Number(it.qty);
      return sum + price * qty;
    }, 0);

    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: req.body.customer,
      notes: req.body.notes || "",
      items: req.body.items,
      subtotal,
    };

    orders.push(order);

    console.log("Checkout saved:", { orderId, subtotal });
    return res.status(200).json({ ok: true, orderId, subtotal });
  }
);

export default router;

