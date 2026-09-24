import { prisma } from "@/lib/prisma";

export type RecentOrder = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
};

export async function getRecentOrders(limit = 8): Promise<RecentOrder[]> {
  const orders = await prisma.order.findMany({
    take: limit,

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      amount: true,
      status: true,
      createdAt: true,

      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    id: order.id,
    user: order.user,
    amount: Number(order.amount),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }));
}
