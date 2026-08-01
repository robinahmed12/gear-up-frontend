import { redirect } from "next/navigation";

import { Navbar } from "@/components/shared/navbar";
import Sidebar from "./_components/DashboardSidebar";

import { getMe } from "@/service/getMe";
import { User } from "@/lib/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardgroupLayout({
  children,
}: DashboardLayoutProps) {
  const user = (await getMe()) as User | null;

  // Defense in depth (middleware should also protect these routes)
  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        <Navbar user={user} />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}