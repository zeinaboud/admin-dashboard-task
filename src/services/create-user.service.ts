import bcrypt from "bcryptjs";

import { prisma } from "@/Lib/prisma";
import type { CreateUserInput } from "@/validation/users/create-user.validation";

export async function createUser(input: CreateUserInput) {
  const email = input.email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
      phone: input.phone || null,
      department: input.department || null,
      role: input.role,
      status: input.status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      department: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  await prisma.activity.create({
    data: {
      userId: user.id,
      action: "USER_CREATED",
      description: `User ${user.name} was created`,
    },
  });

  return user;
}
