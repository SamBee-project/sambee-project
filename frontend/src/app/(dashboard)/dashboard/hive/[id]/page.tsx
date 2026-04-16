"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Weight,
  TrendingUp,
  Calendar,
  Crown,
  Users,
  Layers,
  Activity,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  useGetHiveQuery,
  useGetInspectionsQuery,
  useGetTemperatureHistoryQuery,
} from "@/store/api/apiSlice";
import { TopoBackground } from "@/components/TopoBackground";

export default function HiveDetails() {
  const params = useParams();
  const hiveId = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const { data: hive, isLoading: hiveLoading } = useGetHiveQuery(hiveId, {
    skip: !hiveId,
  });
  const { data: inspections, isLoading: inspectionsLoading } =
    useGetInspectionsQuery(hiveId, { skip: !hiveId });
  const { data: temperatureHistory } = useGetTemperatureHistoryQuery();

  if (hiveLoading || inspectionsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  if (!hive) {
    return (
      <div className="text-center py-12 mt-25 md:mt-10">
        <TopoBackground />
        <h2 className="text-xl text-white">Hive not found</h2>
        <Link href="/dashboard">
          <Button className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const getHealthColor = (health: typeof hive.health) => {
    switch (health) {
      case "excellent":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
    }
  };

  const getQueenStatusColor = (status: typeof hive.queenStatus) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "aging":
        return "text-yellow-400";
      case "missing":
        return "text-red-400";
    }
  };

  const getBroodPatternColor = (pattern: string) => {
    switch (pattern) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-blue-400";
      case "poor":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div>
      <TopoBackground />
      <div className="mt-30 md:mt-15">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="icon"
                className="border-yellow-500/30 hover:bg-yellow-500/10 hover:border-yellow-500"
              >
                <ArrowLeft className="w-4 h-4 text-white" />
              </Button>
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-white">{hive.name}</h2>
                <Badge
                  className={getHealthColor(hive.health)}
                  variant="outline"
                >
                  {hive.health}
                </Badge>
              </div>
              <p className="text-gray-400 mt-1">{hive.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                icon: Thermometer,
                label: "Temperature",
                value: `${hive.temperature}°C`,
                bgColor: "bg-orange-500/20",
                borderColor: "border-orange-500/30",
                iconColor: "text-orange-400",
              },
              {
                icon: Droplets,
                label: "Humidity",
                value: `${hive.humidity}%`,
                bgColor: "bg-blue-500/20",
                borderColor: "border-blue-500/30",
                iconColor: "text-blue-400",
              },
              {
                icon: Weight,
                label: "Weight",
                value: `${hive.weight} kg`,
                bgColor: "bg-purple-500/20",
                borderColor: "border-purple-500/30",
                iconColor: "text-purple-400",
              },
              {
                icon: TrendingUp,
                label: "Production",
                value: `${hive.honeyProduction} kg`,
                bgColor: "bg-green-500/20",
                borderColor: "border-green-500/30",
                iconColor: "text-green-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0 border ${stat.borderColor}`}
                      >
                        <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{stat.label}</p>
                        <p className="text-lg font-bold text-white">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-black/50 border border-yellow-500/20">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="inspections"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
                >
                  Inspections
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Colony Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Crown
                            className={`w-5 h-5 ${getQueenStatusColor(
                              hive.queenStatus,
                            )}`}
                          />
                          <span className="text-gray-400">Queen Status</span>
                        </div>
                        <span className="font-medium text-white capitalize">
                          {hive.queenStatus}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-400">Population</span>
                        </div>
                        <span className="font-medium text-white">
                          {hive.population.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Layers className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-400">Frames</span>
                        </div>
                        <span className="font-medium text-white">
                          {hive.frames}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-400">Last Inspection</span>
                        </div>
                        <span className="font-medium text-white">
                          {new Date(hive.lastInspection).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-400">Health Status</span>
                        </div>
                        <Badge
                          className={getHealthColor(hive.health)}
                          variant="outline"
                        >
                          {hive.health}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Environmental Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Temperature
                          </span>
                          <span className="text-sm font-medium text-white">
                            {hive.temperature}°C
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              hive.temperature >= 33 && hive.temperature <= 36
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                            style={{
                              width: `${(hive.temperature / 40) * 100}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Optimal: 33-36°C
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Humidity
                          </span>
                          <span className="text-sm font-medium text-white">
                            {hive.humidity}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              hive.humidity >= 50 && hive.humidity <= 60
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                            style={{ width: `${hive.humidity}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Optimal: 50-60%
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">
                            Hive Weight
                          </span>
                          <span className="text-sm font-medium text-white">
                            {hive.weight} kg
                          </span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${(hive.weight / 60) * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Indicates honey stores
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Temperature Trend (Last 10 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                        key="temp-chart-hive"
                      >
                        <LineChart data={temperatureHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="date" stroke="#9ca3af" />
                          <YAxis domain={[25, 40]} stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#000",
                              border: "1px solid #fbbf24",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey={hive.name.toLowerCase().split(" ")[1]}
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{ fill: "#fbbf24", r: 4 }}
                            name={hive.name}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="inspections" className="space-y-4">
                {inspections && inspections.length > 0 ? (
                  inspections.map((inspection, index) => (
                    <motion.div
                      key={inspection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-white">
                                {new Date(inspection.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  },
                                )}
                              </CardTitle>
                              <p className="text-sm text-gray-400 mt-1">
                                Inspected by {inspection.inspector}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                              <p className="text-sm text-gray-400">
                                Queen Seen
                              </p>
                              <p className="font-medium text-white">
                                {inspection.queenSeen ? "Yes" : "No"}
                              </p>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                              <p className="text-sm text-gray-400">
                                Brood Pattern
                              </p>
                              <p
                                className={`font-medium capitalize ${getBroodPatternColor(
                                  inspection.broodPattern,
                                )}`}
                              >
                                {inspection.broodPattern}
                              </p>
                            </div>
                            <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                              <p className="text-sm text-gray-400">
                                Temperament
                              </p>
                              <p className="font-medium text-white capitalize">
                                {inspection.temperament}
                              </p>
                            </div>
                          </div>

                          {inspection.signs && inspection.signs.length > 0 && (
                            <div>
                              <p className="text-sm text-gray-400 mb-2">
                                Observations
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {inspection.signs.map((sign, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                  >
                                    {sign}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="bg-black/30 p-4 rounded-lg border border-yellow-500/10">
                            <p className="text-sm text-gray-400 mb-2">Notes</p>
                            <p className="text-sm text-white">
                              {inspection.notes}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-400">
                        No inspections recorded for this hive yet.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
