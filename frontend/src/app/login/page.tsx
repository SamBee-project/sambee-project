"use client";

import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full bg-main-black flex flex-col items-center justify-start pt-25 p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden pointer-events-none">
        <div className="absolute z-10 -top-5 -right-12 w-96 h-3 bg-main-yellow rotate-35" />
        <div className="absolute z-10 top-1 -right-12 w-96 h-3 bg-main-yellow rotate-35" />
      </div>

      <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/bg.png')]" />
    </main>
  );
}
