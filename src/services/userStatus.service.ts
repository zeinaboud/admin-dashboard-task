import { prisma } from "@/Lib/prisma";

export type UserStatusData = {
  ACTIVE: number;
  PENDING: number;
  INACTIVE: number;
};

export async function getUserStatus(): Promise<UserStatusData> {
  const result = await prisma.user.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  const data: UserStatusData = {
    ACTIVE: 0,
    PENDING: 0,
    INACTIVE: 0,
  };

  for (const item of result) {
    data[item.status] = item._count._all;
  }

  return data;
}
