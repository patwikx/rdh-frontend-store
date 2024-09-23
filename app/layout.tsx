import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";
import { Toaster } from "sonner";
import SessionWrapper from "@/components/session-provider";

const font = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RDH Store",
  description: "RD Hardware Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={font.className}>
    <SessionWrapper>
          <ModalProvider />
          <ToastProvider />
          <Navbar />
          {children}
          <Toaster />
          <Footer />
          </SessionWrapper>
      </body>
    </html>
  );
}
