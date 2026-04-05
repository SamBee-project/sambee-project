import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Thermometer,
  Droplets,
  Weight,
  TrendingUp,
  Calendar,
  Users,
  Crown,
  ChevronRight,
  Loader2,
  X,
  Activity,
  MapPin,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import {
  useGetHivesQuery,
  useGetAlertsQuery,
  useDismissAlertMutation,
} from "../store/api/apiSlice";
import { Hive } from "../types";

export function Dashboard() {
  const { data: hives, isLoading: hivesLoading } = useGetHivesQuery();
  const { data: alerts, isLoading: alertsLoading } = useGetAlertsQuery();
  const [dismissAlert] = useDismissAlertMutation();

  const apiaryStats = {
    totalHives: hives?.length || 0,
    avgTemperature: hives
      ? (
          hives.reduce((sum, h) => sum + h.temperature, 0) / hives.length
        ).toFixed(1)
      : "0.0",
    avgHumidity: hives
      ? (hives.reduce((sum, h) => sum + h.humidity, 0) / hives.length).toFixed(
          1,
        )
      : "0.0",
    avgWeight: hives
      ? (hives.reduce((sum, h) => sum + h.weight, 0) / hives.length).toFixed(1)
      : "0.0",
    totalProduction: hives
      ? hives.reduce((sum, h) => sum + h.honeyProduction, 0).toFixed(1)
      : "0.0",
    healthyHives:
      hives?.filter((h) => h.health === "excellent" || h.health === "good")
        .length || 0,
    activeAlerts: alerts?.filter((a) => a.severity === "high").length || 0,
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      await dismissAlert(alertId).unwrap();
      toast.success("Alert dismissed");
    } catch (error) {
      toast.error("Failed to dismiss alert");
    }
  };

  const getHealthColor = (health: Hive["health"]) => {
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

  const getQueenStatusColor = (status: Hive["queenStatus"]) => {
    switch (status) {
      case "healthy":
        return "text-green-400";
      case "aging":
        return "text-yellow-400";
      case "missing":
        return "text-red-400";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-500/10";
      case "medium":
        return "border-yellow-500 bg-yellow-500/10";
      case "low":
        return "border-blue-500 bg-blue-500/10";
      default:
        return "";
    }
  };

  if (hivesLoading || alertsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">Apiary Overview</h2>
        <p className="text-gray-400 mt-1">
          Overall statistics across all beehives
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            icon: Thermometer,
            value: `${apiaryStats.avgTemperature}°C`,
            label: "Avg Temperature",
            gradient: "from-orange-500/20 to-orange-600/10",
            border: "border-orange-500/30",
            iconColor: "text-orange-500",
          },
          {
            icon: Droplets,
            value: `${apiaryStats.avgHumidity}%`,
            label: "Avg Humidity",
            gradient: "from-blue-500/20 to-blue-600/10",
            border: "border-blue-500/30",
            iconColor: "text-blue-500",
          },
          {
            icon: Weight,
            value: `${apiaryStats.avgWeight} kg`,
            label: "Avg Weight",
            gradient: "from-purple-500/20 to-purple-600/10",
            border: "border-purple-500/30",
            iconColor: "text-purple-500",
          },
          {
            icon: TrendingUp,
            value: `${apiaryStats.totalProduction} kg`,
            label: "Total Production",
            gradient: "from-green-500/20 to-green-600/10",
            border: "border-green-500/30",
            iconColor: "text-green-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <Card className={`bg-linear-to-br ${stat.gradient} ${stat.border}`}>
              <CardContent className="pt-4 pb-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <stat.icon className={`w-8 h-8 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: Users,
            value: apiaryStats.totalHives,
            label: "Total Hives",
            iconColor: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-500/30",
          },
          {
            icon: Activity,
            value: apiaryStats.healthyHives,
            label: "Healthy Hives",
            iconColor: "text-green-500",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-500/30",
          },
          {
            icon: AlertTriangle,
            value: apiaryStats.activeAlerts,
            label: "Active Alerts",
            iconColor: "text-red-500",
            bgColor: "bg-red-500/10",
            borderColor: "border-red-500/30",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
          >
            <Card
              className={`bg-black/50 backdrop-blur-sm ${stat.borderColor}`}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center shrink-0 border ${stat.borderColor}`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {alerts && alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-white">Recent Alerts</h3>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Alert
                  className={`border-l-4 bg-black/50 backdrop-blur-sm text-white ${getSeverityColor(
                    alert.severity,
                  )} relative`}
                >
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription className="text-gray-200 pr-8">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-medium text-white">
                          {alert.hiveName}:
                        </span>{" "}
                        {alert.message}
                      </div>
                      <Badge
                        variant="outline"
                        className="shrink-0 border-yellow-500/50 text-yellow-500"
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => handleDismissAlert(alert.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">All Hives</h3>
          <p className="text-sm text-gray-400">Click a hive to view details</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hives?.map((hive, index) => (
            <motion.div
              key={hive.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/dashboard/hive/${hive.id}`}>
                <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white group-hover:text-yellow-500 transition-colors">
                          {hive.name}
                        </CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <p className="text-sm text-gray-400">
                            {hive.location}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge
                        className={`${getHealthColor(hive.health)}`}
                        variant="outline"
                      >
                        {hive.health}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Crown
                          className={`w-4 h-4 ${getQueenStatusColor(
                            hive.queenStatus,
                          )}`}
                        />
                        <span className="text-xs text-gray-400 capitalize">
                          {hive.queenStatus}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm py-2 px-3 bg-black/30 rounded-lg border border-yellow-500/10">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">Last Check:</span>
                      </div>
                      <span className="font-medium text-white">
                        {new Date(hive.lastInspection).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>

                    <div className="pt-2 text-center">
                      <p className="text-xs text-gray-500">
                        View detailed metrics →
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
