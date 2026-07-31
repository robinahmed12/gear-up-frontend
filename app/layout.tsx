import type { Metadata } from 'next';
import './globals.css';

// Root layout — <html>/<body>, wraps <QueryClientProviderWrapper/> (lib/query-client.ts) + <Toaster/> (sonner), imports globals.css

export const metadata: Metadata = {
  title: 'GearUp',
  description: 'Rent sports & outdoor gear instantly',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
