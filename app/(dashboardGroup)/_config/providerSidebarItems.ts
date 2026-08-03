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
    href: "/provider-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Gear",
    href: "/provider-dashboard/gear",
    icon: Package,
  },
  {
    title: "Add Gear",
    href: "/provider-dashboard/gear/new",
    icon: PlusCircle,
  },
  {
    title: "Incoming Orders",
    href: "/provider-dashboard/orders",
    icon: ClipboardList,
  },
];