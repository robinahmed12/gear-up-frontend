import { redirect } from "next/navigation";

import { getMe } from "@/service/getMe";
import { DashboardShell } from "./_components/DashboardShell";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardGroupLayout({
  children,
}: DashboardLayoutProps) {
  const result = await getMe();
  const user = result.success ? result.data.user : null;

  // Defense in depth (proxy.ts also protects these routes)
  if (!user) {
    redirect("/login");
  }

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
