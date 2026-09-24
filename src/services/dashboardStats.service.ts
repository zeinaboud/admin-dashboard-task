import { prisma } from "@/lib/prisma";

export type DashboardStats = {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalUsers, activeUsers, totalOrders, revenue] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.order.count(),

    prisma.order.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        status: "COMPLETED",
      },
    }),
  ]);

  return {
    totalUsers,
    activeUsers,
    totalOrders,
    revenue: Number(revenue._sum.amount ?? 0),
  };
}
