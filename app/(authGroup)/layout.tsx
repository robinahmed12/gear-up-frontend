import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

export default async function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   // Auth-group pages (login/register/verify) intentionally render without a
   // signed-in navbar identity so a freshly-registered, unverified account
   // does not appear to be logged in while email verification is pending.
   return <div>
    <Navbar user={null}/>
    {children}
    </div>;
}
