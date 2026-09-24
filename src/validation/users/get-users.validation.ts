import { z } from "zod";

export const getUsersSchema = z.object({
  search: z.string().trim().optional(),

  status: z.enum(["ACTIVE", "INACTIVE", "PENDING"]).optional(),

  role: z.enum(["ADMIN", "USER"]).optional(),

  department: z.string().trim().optional(),

  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(5),

  sortBy: z
    .enum(["name", "email", "createdAt", "updatedAt", "status", "role"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type GetUsersParams = z.infer<typeof getUsersSchema>;
