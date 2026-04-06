"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./Button";
import logoImage from "../../../public/logo.png";
import { BarChart3, ClipboardList, Home, LogIn, UserPlus, LogOut } from "lucide-react";

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    router.push("/");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    {
      path: "/dashboard/inspections",
      icon: ClipboardList,
      label: "Inspections",
    },
    { path: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const isHomePage = pathname === "/";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-black/80 backdrop-blur-sm border-b border-yellow-500/20 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src={logoImage}
              alt="SAMBEE Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {!isHomePage && (
              <nav className="flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-yellow-500 text-black"
                          : "text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {!isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-yellow-500/20">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-yellow-500/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/10 px-2"
                  >
                    <LogIn className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-2"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-300 hover:text-red-500 hover:bg-red-500/10 px-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
