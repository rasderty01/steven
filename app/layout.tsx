// app/layout.tsx
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export const metadata = {
  title: "Event Management Platform",
  description: "Professional event management and organization platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={geistSans.className}
      suppressHydrationWarning={true}
    >
      <body className="bg-background text-foreground flex min-h-screen items-center justify-center w-full">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
