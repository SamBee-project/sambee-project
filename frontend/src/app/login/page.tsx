"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { toast } from "sonner";
import { loginSchema, LoginFormData } from "@/schemas/authSchema";
import { TopoBackground } from "@/components/TopoBackground";
import logoImage from "../../../public/logo.png";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Login data:", data);
      toast.success("Login successful! Welcome back.");

      router.push("/");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <TopoBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center mb-8"
        >
          <Image
            src={logoImage}
            alt="SAMBEE Logo"
            width={200}
            height={64}
            priority
            className="h-26 w-auto object-contain"
          />
          <p className="text-gray-400 text-sm mt-1">Smart Beehive Management</p>
        </motion.div>

        <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-white text-center">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500/50"
                      />
                    )}
                  />
                </div>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="pl-10 pr-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500/50"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="flex justify-end">
                <Link
                  href="/password-recovery"
                  className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-11"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-yellow-500/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">
                    New to SAMBEE?
                  </span>
                </div>
              </div>

              <Link href="/register" className="block w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 h-11"
                >
                  Create an Account
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-xs text-gray-500 mt-6"
        >
          © 2026 SAMBEE. Smart Beehive Management System
        </motion.p>
      </motion.div>
    </div>
  );
}
