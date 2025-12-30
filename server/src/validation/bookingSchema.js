import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(7, "Valid phone is required"),
  service: z.string().min(1, "Service is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  notes: z.string().optional(),
  cartItems: z.array(
    z.object({
      name: z.string(),
      group: z.string(),
      price: z.number(),
      qty: z.number()
    })
  ).optional()
});
