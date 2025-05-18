import { redirect } from "next/navigation";
import ProfileForm from "./components/profile-form";
import checkAuth from "@/common/utils/check-auth";


export default async function ProfilePage() {
  const session = await checkAuth();
  if (!session) redirect("/login");

  return <ProfileForm session={session} />;
}
