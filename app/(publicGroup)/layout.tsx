// Public layout — <Navbar user={null-or-server-fetched}/> + <Footer/>, wraps home/gear/payment pages

export default function PublicgroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
