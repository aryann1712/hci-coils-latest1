import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Navbar2 from "@/components/Navbar2";
import DashboardLowerBottom from "@/components/dashboardComponents/DashboardLowerBottom";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import 'bootstrap/dist/css/bootstrap.min.css'

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
            <Navbar />
            <Navbar2 />
            {children}
            <DashboardLowerBottom />
            <Footer />
            <ToastContainer />
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
