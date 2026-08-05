// Public layout — <Navbar user={null-or-server-fetched}/> + <Footer/>, wraps home/gear/payment pages

import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

export default async function PublicGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const result = await getMe();
  const user = result.success ? result.data.user : null;
  return <div>
    <Navbar user={user}/>
    {children}
    <Footer/>
    </div>;
}
