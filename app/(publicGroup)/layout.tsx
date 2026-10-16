import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Gear | GearUp",
  description: "Browse sports & outdoor gear available to rent on GearUp",
  icons: { icon: "/favicon.svg" },
};

export default async function PublicGroupLayout({ children }: { children: React.ReactNode }) {
  const result = await getMe();
  const user = result.success ? result.data.user : null;
  return (
    <div>
      <Navbar user={user} />
      {children}
      <Footer />
    </div>
  );
}
