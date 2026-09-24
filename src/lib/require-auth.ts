import { auth } from "@/auth";

export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      error: "UNAUTHORIZED" as const,
    };
  }

  return {
    session,
    error: null,
  };
}
