import { getUserGrowth, UserGrowthRange } from "@/services/userGrowth.service";
import { NextRequest, NextResponse } from "next/server";

function isValidRange(value: string | null): value is UserGrowthRange {
  return value === "7d" || value === "30d" || value === "this-year";
}

export async function GET(request: NextRequest) {
  try {
    const requestedRange = request.nextUrl.searchParams.get("range");

    const range: UserGrowthRange = isValidRange(requestedRange)
      ? requestedRange
      : "30d";

    const data = await getUserGrowth(range);

    return NextResponse.json({
      data,
      range,
    });
  } catch (error) {
    console.error("Failed to load user growth:", error);

    return NextResponse.json(
      {
        error: "Failed to load user growth",
      },
      {
        status: 500,
      },
    );
  }
}
