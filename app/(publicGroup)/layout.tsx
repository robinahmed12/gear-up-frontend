// Public layout — <Navbar user={null-or-server-fetched}/> + <Footer/>, wraps home/gear/payment pages

import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { User } from "@/lib/types";
import { getMe } from "@/service/getMe";

export default async function PublicgroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const user: User | null = await getMe();
  return <div>
    <Navbar user={user}/>
    {children}
    <Footer/>
    </div>;
}
