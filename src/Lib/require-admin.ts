import { auth } from "@/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      error: "UNAUTHORIZED" as const,
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session,
      error: "FORBIDDEN" as const,
    };
  }

  return {
    session,
    error: null,
  };
}
