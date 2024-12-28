export const metadata = {
  title: "Event Management Platform",
  description: "Professional event management and organization platform",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full">{children}</div>;
}
