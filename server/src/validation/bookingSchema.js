import { z } from "zod";

const phoneRegex = /^\+?[0-9()\-\s]{7,}$/;

export const bookingSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().regex(phoneRegex),

  serviceId: z.number().int().positive(),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),   // "YYYY-MM-DD"
  time: z.string().regex(/^\d{2}:\d{2}$/),         // "HH:MM"

  notes: z.string().max(800).optional().default(""),

  cartItems: z.array(
    z.object({
      name: z.string().trim().min(2).max(140),
      group: z.string().trim().min(2).max(40),
      price: z.number(),
      qty: z.number().int().min(1).max(20),
    })
  ).default([]),
});
