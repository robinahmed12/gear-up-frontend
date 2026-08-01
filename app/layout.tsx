import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/lib/query-client";

export const metadata: Metadata = {
  title: "GearUp",
  description: "Rent sports & outdoor gear instantly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
