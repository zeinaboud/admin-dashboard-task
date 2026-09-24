import { prisma } from "@/lib/prisma";

export async function deleteUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  if (user.role === "ADMIN") {
    throw new Error("CANNOT_DELETE_ADMIN");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return {
    id: user.id,
    name: user.name,
  };
}
