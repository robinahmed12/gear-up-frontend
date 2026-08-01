import { Navbar } from "@/components/shared/navbar";
import { User } from "@/lib/types";
import { getMe } from "@/service/getMe";

export default async function AuthgroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User | null = await getMe();
  return <div>
    <Navbar user={user}/>
    {children}
    </div>;
}
