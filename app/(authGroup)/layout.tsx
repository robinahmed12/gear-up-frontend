import { Navbar } from "@/components/shared/navbar";

export default function AuthgroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>
    <Navbar/>
    {children}
    </div>;
}
