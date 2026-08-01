// Sidebar links for PROVIDER: Overview, My Gear, Add Gear, Incoming Orders
import type { ElementType } from "react";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ClipboardList,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: ElementType;
};

export const providerSidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/dashboard/provider",
    icon: LayoutDashboard,
  },
  {
    title: "My Gear",
    href: "/dashboard/provider/gear",
    icon: Package,
  },
  {
    title: "Add Gear",
    href: "/dashboard/provider/gear/new",
    icon: PlusCircle,
  },
  {
    title: "Incoming Orders",
    href: "/dashboard/provider/orders",
    icon: ClipboardList,
  },
];