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
    href: "/dashboard/customer",
    icon: LayoutDashboard,
  },


  {
    title: "My Orders",
    href: "/dashboard/customer/orders",
    icon: ShoppingBag,
  },


  {
    title: "Payment History",
    href: "/dashboard/customer/payments",
    icon: CreditCard,
  },


  {
    title: "Profile",
    href: "/dashboard/customer/profile",
    icon: User,
  },

];