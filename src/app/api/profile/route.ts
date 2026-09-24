import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/Lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
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
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true,
          },
        },
        activities: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            id: true,
            action: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalOrders, monthlyOrders, orderBreakdown, totalSpent] =
      await Promise.all([
        prisma.order.count({
          where: {
            userId: user.id,
          },
        }),

        prisma.order.count({
          where: {
            userId: user.id,
            createdAt: {
              gte: startOfMonth,
            },
          },
        }),

        prisma.order.groupBy({
          by: ["status"],
          where: {
            userId: user.id,
          },
          _count: {
            _all: true,
          },
        }),

        prisma.order.aggregate({
          where: {
            userId: user.id,
            status: "COMPLETED",
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    const breakdown = {
      COMPLETED: 0,
      PENDING: 0,
      CANCELLED: 0,
    };

    for (const item of orderBreakdown) {
      breakdown[item.status] = item._count._all;
    }

    return NextResponse.json({
      data: {
        user,
        stats: {
          totalOrders,
          monthlyOrders,
          totalSpent: totalSpent._sum.amount ?? 0,
        },
        orderBreakdown: breakdown,
      },
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);

    return NextResponse.json(
      { message: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}
