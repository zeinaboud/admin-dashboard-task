import { getUserStatus } from "@/services/userStatus.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await getUserStatus();

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error("Failed to load user status:", error);

    return NextResponse.json(
      {
        error: "Failed to load user status",
      },
      {
        status: 500,
      },
    );
  }
}
