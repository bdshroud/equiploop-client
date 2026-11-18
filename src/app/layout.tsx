import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "EquipLoop — Rent smarter. Work better. | Commercial Equipment Rental",
  description:
    "EquipLoop is a commercial-grade equipment rental marketplace connecting contractors, construction crews, and trades with verified equipment owners.",
  keywords: [
    "equipment rental",
    "heavy machinery rental",
    "construction tools",
    "scissor lift rental",
    "generator rental",
    "tool hire",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground transition-colors selection:bg-amber/30 selection:text-amber-900 dark:selection:text-amber-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="equiploop-theme"
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
