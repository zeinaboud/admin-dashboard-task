import { prisma } from "@/Lib/prisma";
import type { GetUsersParams } from "@/validation/users/get-users.validation";

export async function getUsers(params: GetUsersParams) {
  const { search, status, role, department, page, limit, sortBy, sortOrder } =
    params;

  const where = {
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),

    ...(status ? { status } : {}),
    ...(role ? { role } : {}),
    ...(department ? { department } : {}),
  };

  const [users, total, active, pending, inactive] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        department: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            orders: true,
            activities: true,
          },
        },
      },
    }),

    prisma.user.count({
      where,
    }),

    prisma.user.count({
      where: {
        ...where,
        status: "ACTIVE",
      },
    }),

    prisma.user.count({
      where: {
        ...where,
        status: "PENDING",
      },
    }),

    prisma.user.count({
      where: {
        ...where,
        status: "INACTIVE",
      },
    }),
  ]);

  return {
    data: users,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },

    stats: {
      total,
      active,
      pending,
      inactive,
    },
  };
}
