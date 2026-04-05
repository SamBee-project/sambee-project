import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Header } from "../../components/ui/Header";
import { Footer } from "@/components/ui/Footer";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const gruntGrotesk = localFont({
  src: "../../assets/fonts/GruntGrotesk-Bold.woff2",
  variable: "--font-grunt-grotesk",
});

export const metadata: Metadata = {
  title: "SamBee",
  description: "Beehive Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${gruntGrotesk.variable} antialiased bg-black text-white min-h-screen`}
      >
        <StoreProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {children}
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
