"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { customerSidebarItems } from "../_config/customerSidebarItems";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

interface User {
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  name?: string;
}

interface SidebarProps {
  user: User | null;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  let sidebarItems: SidebarItem[] = [];

  switch (user!.role) {
    case "CUSTOMER":
      sidebarItems = customerSidebarItems;

      break;

    // future:
    // case "PROVIDER":
    //   sidebarItems = providerSidebarItems;
    //   break;

    // case "ADMIN":
    //   sidebarItems = adminSidebarItems;
    //   break;

    default:
      sidebarItems = [];
  }

  return (
    <aside className="h-screen w-64 border-r p-5">
      <div className="mb-8">
        <h2 className="text-xl font-bold">GearUp</h2>

        <p className="text-sm text-muted-foreground">{user!.name}</p>
      </div>

      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                  flex items-center gap-3 rounded-md px-3 py-2
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }
                  `}
            >
              <Icon size={18} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
