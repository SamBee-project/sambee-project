"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import { Checkbox } from "../../../components/ui/Checkbox";
import { toast } from "sonner";
import {
  registrationSchema,
  RegistrationFormData,
} from "../../../schemas/authSchema";
import { TopoBackground } from "../../../components/TopoBackground";
import logoImage from "../../../../public/logo.png";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registration data:", data);
      toast.success("Account created successfully! Welcome to SAMBEE.");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
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
            className="h-26 w-auto object-contain"
          />
          <p className="text-gray-400 text-sm mt-1">Smart Beehive Management</p>
        </motion.div>

        <Card className="bg-black/50 backdrop-blur-lg border-yellow-500/20 shadow-2xl shadow-yellow-500/5">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-white text-center">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Join SAMBEE and start managing your hives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        {...field}
                        className="pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500/50"
                      />
                    )}
                  />
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        className="pl-10 pr-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500 focus:border-yellow-500/50"
                      />
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <Controller
                  name="acceptTerms"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="acceptTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-yellow-500/30 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 mt-0.5"
                      />
                      <label
                        htmlFor="acceptTerms"
                        className="text-sm text-gray-400 leading-tight cursor-pointer"
                      >
                        I agree to the{" "}
                        <span className="text-yellow-500 hover:text-yellow-400">
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span className="text-yellow-500 hover:text-yellow-400">
                          Privacy Policy
                        </span>
                      </label>
                    </div>
                  )}
                />
                {errors.acceptTerms && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs"
                  >
                    {errors.acceptTerms.message}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-11 mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-yellow-500/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link href="/login">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 hover:text-yellow-400 h-11"
                >
                  Sign In
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
