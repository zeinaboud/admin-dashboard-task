import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { deleteUserSchema } from "@/validation/users/delete-user.validation";
import { requireAdmin } from "@/Lib/require-admin";
import { deleteUser } from "@/services/delete-user.service";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireAdmin();

  if (error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (error === "FORBIDDEN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await context.params;

    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      data: user,
    });
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireAdmin();

  if (error === "UNAUTHORIZED") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (error === "FORBIDDEN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await context.params;

    const { id: userId } = deleteUserSchema.parse({
      id,
    });

    const user = await deleteUser(userId);

    return NextResponse.json({
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Invalid user ID",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (error instanceof Error && error.message === "CANNOT_DELETE_ADMIN") {
      return NextResponse.json(
        { message: "Admin users cannot be deleted" },
        { status: 400 },
      );
    }

    console.error("DELETE /api/users/[id] error:", error);

    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 },
    );
  }
}
