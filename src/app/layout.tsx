import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ServerNavbar from "@/components/ServerNavbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CardContext";
import Navbar2 from "@/components/Navbar2";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HCI COILS",
  description: "Hci Coils",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        <CartProvider>
          <ServerNavbar />
          <Navbar2 />
          {children}
          <Footer />
        </CartProvider>

      </body>
    </html>
  );
}
