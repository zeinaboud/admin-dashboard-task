import { UserOverview } from "@/components/users/profile/UserOverview";

type UserDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const { id } = await params;

  return <UserOverview userId={id} />;
}
