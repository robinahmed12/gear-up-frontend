// Sidebar links for CUSTOMER: Overview, My Orders, Payment History, Profile
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  User,
} from "lucide-react";


export const customerSidebarItems = [

  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },


  {
    title: "My Orders",
    href: "/dashboard/my-orders",
    icon: ShoppingBag,
  },


  {
    title: "Payment History",
    href: "/dashboard/payment-history",
    icon: CreditCard,
  },


  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },

];