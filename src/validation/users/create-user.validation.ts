import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number is too long")
    .optional()
    .or(z.literal("")),

  department: z
    .string()
    .trim()
    .max(100, "Department is too long")
    .optional()
    .or(z.literal("")),

  role: z.enum(["ADMIN", "USER"]).default("USER"),

  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).default("ACTIVE"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
