// Sidebar links for ADMIN: Overview, Users, Gear Moderation, Rental Oversight
import type { ElementType } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ClipboardCheck,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: ElementType;
};

export const adminSidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/admin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    href: "/admin-dashboard/users",
    icon: Users,
  },
  {
    title: "Gear Moderation",
    href: "/admin-dashboard/gear",
    icon: ShieldCheck,
  },
  {
    title: "Rental Oversight",
    href: "/admin-dashboard/rentals",
    icon: ClipboardCheck,
  },
];