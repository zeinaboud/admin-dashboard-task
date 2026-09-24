import { z } from "zod";

export const addUserStep1Schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z.string().trim().email("Please enter a valid email address"),

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
});

export type AddUserStep1Input = z.infer<typeof addUserStep1Schema>;

/* Role & Access */

export const addUserStep2Schema = z
  .object({
    role: z.enum(["ADMIN", "USER"]),

    status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    confirmPassword: z.string().min(8, "Please confirm the password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddUserStep2Input = z.infer<typeof addUserStep2Schema>;

/* Review */

export const addUserStep3Schema = z.object({
  termsAccepted: z.literal(true, {
    message: "You must confirm the information before creating the user",
  }),
});

export type AddUserStep3Input = z.infer<typeof addUserStep3Schema>;

export const addUserSchema = addUserStep1Schema
  .and(addUserStep2Schema)
  .and(addUserStep3Schema);

export type AddUserInput = z.infer<typeof addUserSchema>;
