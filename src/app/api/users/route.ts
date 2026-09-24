import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { getUsersSchema } from "@/validation/users/get-users.validation";
import { createUserSchema } from "@/validation/users/create-user.validation";
import { requireAdmin } from "@/lib/require-admin";
import { requireAuth } from "@/lib/require-auth";
import { getUsers } from "@/services/get-user.service";
import { createUser } from "@/services/create-user.service";

export async function GET(request: NextRequest) {
  const { error } = await requireAdmin();

  if (error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (error === "FORBIDDEN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);

    const params = getUsersSchema.parse(
      Object.fromEntries(searchParams.entries()),
    );

    const result = await getUsers(params);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    console.error("GET /api/users error:", error);

    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();

  if (error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (error === "FORBIDDEN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const input = createUserSchema.parse(body);

    const user = await createUser(input);

    return NextResponse.json(
      {
        message: "User created successfully",
        data: user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid request data",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
      return NextResponse.json(
        {
          message: "A user with this email already exists",
        },
        { status: 409 },
      );
    }

    console.error("POST /api/users error:", error);

    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 },
    );
  }
}
