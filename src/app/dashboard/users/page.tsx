import { redirect } from "next/navigation";

import { UsersPage } from "@/components/users/UserPage";
import { requireAdmin } from "@/lib/require-admin";

export default async function UsersRoute() {
  const { error } = await requireAdmin();

  if (error === "UNAUTHORIZED") {
    redirect("/login");
  }

  if (error === "FORBIDDEN") {
    redirect("/dashboard/profile");
  }

  return <UsersPage />;
}
