// Shared shell for all 3 roles — async Server Component, calls service/getMe.ts, redirects to /login if unauthenticated (defense-in-depth alongside proxy.ts), renders <Navbar user={user}/> + role-matched <DashboardSidebar user={user}/> from _components + _config

import { Navbar } from "@/components/shared/navbar";

export default function DashboardgroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
    <Navbar/>
    {children}
    </div>;
}
