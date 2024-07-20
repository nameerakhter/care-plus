import { z } from "zod";

export const UserFormValidation = z.object({
    username: z.string().min(2, "Username must be at least 2 characters.",).max(30, "Username must be at most 20 characters."),
    email: z.string().email("Invalid email address."),
        phone:z.string().refine((phone) => /^\+\d{10,15}$/.test(phone), 'Invalid phone number.'),
   
  })