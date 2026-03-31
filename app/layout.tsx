import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "ELVIOGROUP | Fashion Shop",
  description: "Welcome to our fashion shop!",
  icons: {
    icon: "/ELVIOGROUP-Logo_3.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Navbar />
        <main className="navbar-fixed">{children}</main>
      </body>
    </html>
  );
}
