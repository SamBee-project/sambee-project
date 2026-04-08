import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Orbitron } from "next/font/google";
import localFont from "next/font/local";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SamBee",
  description: "Пример макета на TypeScript",
};

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const gruntGrotesk = localFont({
  src: "../assets/fonts/GruntGrotesk-Bold.woff2",
  variable: "--font-grunt-grotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk" className="dark">
      <body
        className={`${orbitron.variable} ${gruntGrotesk.variable} antialiased bg-black text-white min-h-screen`}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
