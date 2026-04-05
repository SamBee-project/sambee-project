"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  Thermometer,
  TrendingUp,
  Users,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { TopoBackground } from "../components/TopoBackground";
import { Footer } from "@/components/ui/Footer";

export default function Welcome() {
  const features = [
    {
      icon: Activity,
      title: "Real-Time Monitoring",
      description: "Track temperature, humidity, and hive weight in real-time",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/30",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Visualize trends and production data with interactive charts",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified about critical issues that need attention",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/30",
    },
    {
      icon: TrendingUp,
      title: "Production Tracking",
      description: "Monitor honey production and colony growth over time",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/30",
    },
    {
      icon: Users,
      title: "Multi-Hive Management",
      description: "Manage multiple hives from a single dashboard",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Shield,
      title: "Inspection Logs",
      description:
        "Keep detailed records of all hive inspections and activities",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
    },
  ];

  const benefits = [
    "Monitor environmental conditions 24/7",
    "Make data-driven decisions",
    "Detect problems before they escalate",
    "Optimize honey production",
    "Maintain comprehensive records",
    "Access from any device, anywhere",
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <TopoBackground />

      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-yellow-500 font-medium">
                Smart Beehive Management
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight">
              Monitor Your Apiary with{" "}
              <span className="text-yellow-500">Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              SAMBEE provides comprehensive beehive monitoring and management
              tools. Track environmental conditions, log inspections, and
              optimize honey production with real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-6 h-auto group"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-yellow-500/50 text-white hover:bg-yellow-500/10 hover:border-yellow-500 text-lg px-8 py-6 h-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
            >
              {[
                { value: "24/7", label: "Monitoring" },
                { value: "Real-time", label: "Alerts" },
                { value: "Multi-hive", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-yellow-500">
                    {stat.value}
                  </p>
                  <p className="text-sm md:text-base text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools to manage your beekeeping operation
              efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  className={`bg-black/50 backdrop-blur-sm border-yellow-500/20 hover:border-yellow-500/50 transition-all h-full ${feature.borderColor}`}
                >
                  <CardContent className="pt-6 pb-6">
                    <div
                      className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 border ${feature.borderColor}`}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                Why Choose SAMBEE?
              </h2>
              <p className="text-lg text-gray-400">
                Our platform combines cutting-edge IoT technology with intuitive
                design to give you complete control over your beekeeping
                operation.
              </p>
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
                    <span className="text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <div className="pt-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black group"
                  >
                    Get Started Today
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="bg-linear-to-br from-yellow-500/20 to-orange-500/10 border-yellow-500/30 backdrop-blur-sm">
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-3">
                        <Thermometer className="w-5 h-5 text-orange-500" />
                        <span className="text-white">Avg Temperature</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        34.2°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        <span className="text-white">Production</span>
                      </div>
                      <span className="text-2xl font-bold text-white">
                        63.8 kg
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-blue-500" />
                        <span className="text-white">Active Hives</span>
                      </div>
                      <span className="text-2xl font-bold text-white">6</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-yellow-500/20">
                    <p className="text-center text-sm text-gray-400">
                      Real-time dashboard preview
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Card className="bg-linear-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Join beekeepers who are already using SAMBEE to manage their
                  hives smarter and more efficiently.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-6 h-auto group"
                    >
                      Create Free Account
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="text-white hover:bg-yellow-500/10 text-lg px-8 py-6 h-auto"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
