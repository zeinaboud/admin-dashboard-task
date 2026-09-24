import { z } from "zod";

export const deleteUserSchema = z.object({
  id: z.string().min(1, "User ID is required"),
});

export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
