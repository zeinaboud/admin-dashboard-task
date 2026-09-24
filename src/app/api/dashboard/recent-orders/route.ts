import { getRecentOrders } from "@/services/recentOrders.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const requestedLimit = Number(
      request.nextUrl.searchParams.get("limit") ?? "8",
    );

    const limit = Math.min(Math.max(requestedLimit, 1), 20);

    const data = await getRecentOrders(limit);

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Failed to load recent orders:", error);

    return NextResponse.json(
      {
        error: "Failed to load recent orders",
      },
      {
        status: 500,
      },
    );
  }
}
