// Public layout — <Navbar user={null-or-server-fetched}/> + <Footer/>, wraps home/gear/payment pages

import { Navbar } from "@/components/shared/navbar";

export default function PublicgroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
    <Navbar/>
    {children}
    </div>;
}
