"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/Tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useGetHivesQuery,
  useGetTemperatureHistoryQuery,
  useGetHoneyProductionHistoryQuery,
} from "../../../../store/api/apiSlice";
import { TrendingUp, Activity, Loader2 } from "lucide-react";
import { TopoBackground } from "@/components/TopoBackground";

export default function Analytics() {
  const { data: hives, isLoading: hivesLoading } = useGetHivesQuery();
  const { data: temperatureHistory, isLoading: tempLoading } =
    useGetTemperatureHistoryQuery();
  const { data: honeyProductionHistory, isLoading: prodLoading } =
    useGetHoneyProductionHistoryQuery();

  if (hivesLoading || tempLoading || prodLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  const totalProduction = hives
    ? hives.reduce((sum, h) => sum + h.honeyProduction, 0)
    : 0;
  const avgTemperature = hives
    ? (hives.reduce((sum, h) => sum + h.temperature, 0) / hives.length).toFixed(
        1,
      )
    : "0.0";
  const avgHumidity = hives
    ? (hives.reduce((sum, h) => sum + h.humidity, 0) / hives.length).toFixed(1)
    : "0.0";

  const productionByHive = hives?.map((hive) => ({
    name: hive.name,
    production: hive.honeyProduction,
    population: hive.population / 1000,
  }));

  const healthDistribution = [
    {
      status: "Excellent",
      count: hives?.filter((h) => h.health === "excellent").length || 0,
    },
    {
      status: "Good",
      count: hives?.filter((h) => h.health === "good").length || 0,
    },
    {
      status: "Warning",
      count: hives?.filter((h) => h.health === "warning").length || 0,
    },
    {
      status: "Critical",
      count: hives?.filter((h) => h.health === "critical").length || 0,
    },
  ];

  return (
    <div>
      <TopoBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 mt-30 md:mt-15"
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-gray-400 mt-1">
            Performance metrics and trends across all hives
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Production",
              value: `${totalProduction.toFixed(1)} kg`,
              trend: "+0% vs last month",
              icon: Activity,
            },
            {
              label: "Avg Temperature",
              value: `${avgTemperature}°C`,
              trend: "Optimal: 33-36°C",
              icon: Activity,
            },
            {
              label: "Avg Humidity",
              value: `${avgHumidity}%`,
              trend: "Optimal: 50-60%",
              icon: Activity,
            },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">{metric.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {metric.value}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-sm text-green-400">
                        {index === 0 && <TrendingUp className="w-4 h-4" />}
                        <span className={index === 0 ? "" : "text-gray-500"}>
                          {metric.trend}
                        </span>
                      </div>
                    </div>
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                      <metric.icon className="w-6 h-6 text-yellow-500" />
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
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="temperature" className="space-y-4">
            <TabsList className="bg-black/50 border border-yellow-500/20">
              <TabsTrigger
                value="temperature"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Temperature
              </TabsTrigger>
              <TabsTrigger
                value="production"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Production
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
              >
                Health
              </TabsTrigger>
            </TabsList>

            <TabsContent value="temperature">
              <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Temperature Monitoring (Last 10 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                      key="analytics-temp-chart"
                    >
                      <LineChart data={temperatureHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                        <Legend />
                        <Line
                          key="line-alpha"
                          type="monotone"
                          dataKey="alpha"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Hive Alpha"
                        />
                        <Line
                          key="line-bravo"
                          type="monotone"
                          dataKey="bravo"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Hive Bravo"
                        />
                        <Line
                          key="line-charlie"
                          type="monotone"
                          dataKey="charlie"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          name="Hive Charlie"
                        />
                        <Line
                          key="line-delta"
                          type="monotone"
                          dataKey="delta"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          name="Hive Delta"
                        />
                        <Line
                          key="line-echo"
                          type="monotone"
                          dataKey="echo"
                          stroke="#ef4444"
                          strokeWidth={2}
                          name="Hive Echo"
                        />
                        <Line
                          key="line-foxtrot"
                          type="monotone"
                          dataKey="foxtrot"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          name="Hive Foxtrot"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Production by Hive
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={productionByHive}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            stroke="#9ca3af"
                          />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#000",
                              border: "1px solid #fbbf24",
                              borderRadius: "8px",
                              color: "#fff",
                            }}
                          />
                          <Bar
                            dataKey="production"
                            fill="#fbbf24"
                            name="Production (kg)"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Monthly Production Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={honeyProductionHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                          />
                          <XAxis dataKey="month" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
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
                            dataKey="production"
                            stroke="#fbbf24"
                            strokeWidth={3}
                            dot={{ fill: "#fbbf24", r: 5 }}
                            name="Total Production (kg)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Population vs Production
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productionByHive}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          stroke="#9ca3af"
                        />
                        <YAxis yAxisId="left" stroke="#9ca3af" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#9ca3af"
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "1px solid #fbbf24",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Legend />
                        <Bar
                          yAxisId="left"
                          dataKey="production"
                          fill="#fbbf24"
                          name="Production (kg)"
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="population"
                          fill="#3b82f6"
                          name="Population (1000s)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health">
              <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                <CardHeader>
                  <CardTitle className="text-white">
                    Health Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={healthDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="status" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "1px solid #fbbf24",
                            borderRadius: "8px",
                            color: "#fff",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="#3b82f6"
                          name="Number of Hives"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {healthDistribution.map((item, index) => (
                      <motion.div
                        key={item.status}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-4 bg-black/30 border border-yellow-500/20 rounded-lg text-center"
                      >
                        <p className="text-3xl font-bold text-white">
                          {item.count}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          {item.status}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}
