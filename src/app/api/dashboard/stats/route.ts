import { getDashboardStats } from "@/services/dashboardStats.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getDashboardStats();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Failed to load dashboard stats:", error);

    return NextResponse.json(
      {
        error: "Failed to load dashboard stats",
      },
      {
        status: 500,
      },
    );
  }
}
