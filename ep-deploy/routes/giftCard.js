import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/",
  [
    body("fromName").trim().isLength({ min: 2, max: 80 }).withMessage("From name is required."),
    body("toName").trim().isLength({ min: 2, max: 80 }).withMessage("Recipient name is required."),
    body("toEmail").trim().isEmail().withMessage("Valid recipient email is required."),
    body("amount")
      .toInt()
      .isInt({ min: 10, max: 1000 })
      .withMessage("Amount must be between $10 and $1000."),
    body("message").optional({ nullable: true }).isLength({ max: 240 }).withMessage("Message too long."),
  ],
  (req, res) => {
    console.log("Incoming gift card:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Gift card validation failed:", errors.array());
      return res.status(400).json({ message: "Validation failed.", errors: errors.array() });
    }


    return res.status(200).json({ ok: true });
  }
);

export default router;
