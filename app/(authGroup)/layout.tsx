import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

export default async function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const result = await getMe();
  const user = result.success ? result.data : null;
  return <div>
    <Navbar user={user}/>
    {children}
    </div>;
}
