import express from "express";
import { bookingSchema } from "../src/validation/bookingSchema.js";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("Incoming booking data:", req.body);

  const result = bookingSchema.safeParse(req.body);
  if (!result.success) {
    console.log("Validation error:", result.error.flatten());
    return res.status(400).json({ message: "Validation failed.", errors: result.error.flatten() });
  }

  console.log("Validated booking:", result.data);
  return res.json({ success: true, message: "Booking received" });
});

export default router;

