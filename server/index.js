import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.js";
import giftCardRouter from "./routes/giftCard.js";
import checkoutRouter from "./routes/checkout.js";
import servicesRouter from "./routes/services.js";
import { pool } from "./db/pool.js";

dotenv.config();
pool.query("SELECT 1")
  .then(() => console.log("✅ MySQL connected"))
  .catch((e) => console.error("❌ MySQL connection failed:", e));
const app = express();
console.log("DB_USER =", process.env.DB_USER);
console.log("DB_NAME =", process.env.DB_NAME);

const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

/**
 * Body parsing
 */
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

/**
 * Health check
 */
app.get("/api/health", (_req, res) => res.json({ ok: true }));

/**
 * API routes
 */
app.use("/api/booking", bookingRouter);
app.use("/api/gift-card", giftCardRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/services", servicesRouter);

/**
 * 404 for unknown API routes
 */
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "API route not found" });
});

/**
 * Error handler
 */
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Server error. Please try again later." });
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`Dreamy server running on http://localhost:${port}`);
  console.log(`Allowed CORS origin: ${allowedOrigin}`);
});


