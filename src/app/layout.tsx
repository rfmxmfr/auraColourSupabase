
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { cn } from "@/lib/utils";
import I18nProvider from "@/components/I18nProvider";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Aura Colours",
  description: "Personalized color analysis and styling services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <I18nProvider>
          {children}
          <FeedbackWidget />
          <Toaster richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
