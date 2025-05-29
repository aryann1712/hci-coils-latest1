import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Navbar2 from "@/components/Navbar2";
import DashboardLowerBottom from "@/components/dashboardComponents/DashboardLowerBottom";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
        <UserProvider>
          <CartProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#fff',
                  color: '#333',
                  padding: '16px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
            />
            <Navbar />
            <Navbar2 />
            {children}
            <DashboardLowerBottom />
            <Footer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
