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

      <div className="relative p-5 z-10 w-full max-w-sm flex flex-col items-center">
        <Image src="/logo.png" alt="logo" width={252} height={144} />

        <form className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-main-white font-orbitron text-center text-xl uppercase tracking-widest">
              Login
            </label>
            <input
              type="text"
              placeholder="Value"
              className="w-full bg-main-black border placeholder:text-main-white border-main-white rounded-lg px-4 py-3 text-main-white font-orbitron focus:border-main-yellow outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-main-white font-orbitron text-center text-xl uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              placeholder="Value"
              className="w-full bg-main-black border placeholder:text-main-white border-main-white rounded-lg px-4 py-3 text-main-white font-orbitron focus:border-main-yellow outline-none transition-all"
            />
          </div>
        </form>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-cover bg-[url('/bg.png')]" />
    </main>
  );
}
