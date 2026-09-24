import { AddUserForm } from "@/components/users/adduser/AddUserForm";
import { requireAdmin } from "@/Lib/require-admin";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  const { error } = await requireAdmin();

  if (error === "UNAUTHORIZED") {
    redirect("/login");
  }

  if (error === "FORBIDDEN") {
    redirect("/dashboard/profile");
  }

  return <AddUserForm />;
}
