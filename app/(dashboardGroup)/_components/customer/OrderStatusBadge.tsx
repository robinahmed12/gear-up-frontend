import { Badge } from "@/components/ui/badge";


interface OrderStatusBadgeProps {
  status:
    | "PLACED"
    | "CONFIRMED"
    | "PAID"
    | "PICKED_UP"
    | "RETURNED"
    | "CANCELLED"
    | string;
}


export default function OrderStatusBadge({
  status,
}: OrderStatusBadgeProps) {


  const statusStyles: Record<string, string> = {

    PLACED:
      "bg-orange-100 text-orange-700 border-orange-200",

    CONFIRMED:
      "bg-blue-100 text-blue-700 border-blue-200",

    PAID:
      "bg-purple-100 text-purple-700 border-purple-200",

    PICKED_UP:
      "bg-green-100 text-green-700 border-green-200",

    RETURNED:
      "bg-gray-100 text-gray-700 border-gray-200",

    CANCELLED:
      "bg-red-100 text-red-700 border-red-200",

  };


  return (

    <Badge
      variant="outline"
      className={
        statusStyles[status] ??
        "bg-gray-100 text-gray-700"
      }
    >
      {status.replace("_", " ")}
    </Badge>

  );
}