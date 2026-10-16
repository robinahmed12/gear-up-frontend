import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/query-client";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "GearUp - Rent Sports & Outdoor Gear",
    template: "%s | GearUp",
  },
  description: "Rent sports & outdoor gear instantly",
  icons: {
    icon: [ "/favicon.svg" ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
