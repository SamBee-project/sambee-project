"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  User,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../../../components/ui/Dialog";
import { Input } from "../../../../components/ui/Input";
import { Label } from "../../../../components/ui/Label";
import { Textarea } from "../../../../components/ui/Textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/Select";
import { toast } from "sonner";
import {
  useGetInspectionsQuery,
  useGetHivesQuery,
  useCreateInspectionMutation,
} from "../../../../store/api/apiSlice";
import {
  inspectionSchema,
  InspectionFormData,
} from "../../../../schemas/inspectionSchema";
import { TopoBackground } from "@/components/TopoBackground";

export default function Inspections() {
  const { data: inspections, isLoading: inspectionsLoading } =
    useGetInspectionsQuery();
  const { data: hives } = useGetHivesQuery();
  const [createInspection, { isLoading: isCreating }] =
    useCreateInspectionMutation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema) as any,
    defaultValues: {
      hiveId: "",
      inspector: "",
      queenSeen: false,
      broodPattern: "good",
      temperament: "normal",
      notes: "",
      signs: [],
      date: new Date().toISOString().split("T")[0],
    },
  });

  const getBroodPatternColor = (pattern: string) => {
    switch (pattern) {
      case "excellent":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "good":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "poor":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const onSubmit = async (data: InspectionFormData) => {
    try {
      await createInspection(data).unwrap();
      toast.success("Inspection logged successfully!");
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to log inspection");
    }
  };

  if (inspectionsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div>
      <TopoBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 mt-30 md:mt-15"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Inspection History
            </h2>
            <p className="text-gray-400 mt-1">
              View and record hive inspections
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-black border-yellow-500/30">
              <DialogHeader>
                <DialogTitle className="text-white">
                  Record New Inspection
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Fill out the inspection details for the selected hive.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="hiveId" className="text-gray-300">
                    Hive *
                  </Label>
                  <Controller
                    name="hiveId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id="hiveId"
                          className="bg-black/50 border-yellow-500/30 text-white"
                        >
                          <SelectValue placeholder="Select a hive" />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-yellow-500/30">
                          {hives?.map((hive) => (
                            <SelectItem
                              key={hive.id}
                              value={hive.id}
                              className="text-white"
                            >
                              {hive.name} - {hive.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.hiveId && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.hiveId.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="date" className="text-gray-300">
                    Date *
                  </Label>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="date"
                        type="date"
                        {...field}
                        className="bg-black/50 border-yellow-500/30 text-white"
                      />
                    )}
                  />
                  {errors.date && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="inspector" className="text-gray-300">
                    Inspector Name *
                  </Label>
                  <Controller
                    name="inspector"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="inspector"
                        {...field}
                        placeholder="Enter your name"
                        className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500"
                      />
                    )}
                  />
                  {errors.inspector && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.inspector.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="queenSeen" className="text-gray-300">
                    Queen Seen? *
                  </Label>
                  <Controller
                    name="queenSeen"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value ? "true" : "false"}
                      >
                        <SelectTrigger
                          id="queenSeen"
                          className="bg-black/50 border-yellow-500/30 text-white"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-yellow-500/30">
                          <SelectItem value="true" className="text-white">
                            Yes
                          </SelectItem>
                          <SelectItem value="false" className="text-white">
                            No
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Label htmlFor="broodPattern" className="text-gray-300">
                    Brood Pattern *
                  </Label>
                  <Controller
                    name="broodPattern"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id="broodPattern"
                          className="bg-black/50 border-yellow-500/30 text-white"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-yellow-500/30">
                          <SelectItem value="excellent" className="text-white">
                            Excellent
                          </SelectItem>
                          <SelectItem value="good" className="text-white">
                            Good
                          </SelectItem>
                          <SelectItem value="poor" className="text-white">
                            Poor
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.broodPattern && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.broodPattern.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="temperament" className="text-gray-300">
                    Temperament *
                  </Label>
                  <Controller
                    name="temperament"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger
                          id="temperament"
                          className="bg-black/50 border-yellow-500/30 text-white"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black border-yellow-500/30">
                          <SelectItem value="calm" className="text-white">
                            Calm
                          </SelectItem>
                          <SelectItem value="normal" className="text-white">
                            Normal
                          </SelectItem>
                          <SelectItem value="aggressive" className="text-white">
                            Aggressive
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.temperament && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.temperament.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="signs" className="text-gray-300">
                    Observations (comma-separated)
                  </Label>
                  <Controller
                    name="signs"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="signs"
                        {...field}
                        value={field.value ? field.value.join(", ") : ""}
                        onChange={(e) => {
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((s) => s.trim())
                              .filter(Boolean),
                          );
                        }}
                        placeholder="e.g., mites, chalkbrood, low honey stores"
                        rows={3}
                        className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500"
                      />
                    )}
                  />
                  {errors.signs && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.signs.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="notes" className="text-gray-300">
                    Notes *
                  </Label>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        id="notes"
                        {...field}
                        placeholder="Add any observations or notes..."
                        rows={4}
                        className="bg-black/50 border-yellow-500/30 text-white placeholder:text-gray-500"
                      />
                    )}
                  />
                  {errors.notes && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.notes.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Inspection"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Total Inspections",
              value: inspections?.length || 0,
            },
            {
              label: "Queens Sighted",
              value: inspections?.filter((i) => i.queenSeen).length || 0,
            },
            {
              label: "Excellent Brood",
              value:
                inspections?.filter((i) => i.broodPattern === "excellent")
                  .length || 0,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          {inspections?.map((inspection, index) => (
            <motion.div
              key={inspection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Card className="bg-black/50 backdrop-blur-sm border-yellow-500/20">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-white">
                        {inspection.hiveName}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(inspection.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {inspection.inspector}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={getBroodPatternColor(inspection.broodPattern)}
                      variant="outline"
                    >
                      {inspection.broodPattern} brood
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                      {inspection.queenSeen ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-xs text-gray-400">Queen Seen</p>
                        <p className="text-sm font-medium text-white">
                          {inspection.queenSeen ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                      <p className="text-xs text-gray-400">Temperament</p>
                      <p className="text-sm font-medium text-white capitalize">
                        {inspection.temperament}
                      </p>
                    </div>

                    <div className="bg-black/30 p-3 rounded-lg border border-yellow-500/10">
                      <p className="text-xs text-gray-400">Brood Pattern</p>
                      <p className="text-sm font-medium text-white capitalize">
                        {inspection.broodPattern}
                      </p>
                    </div>
                  </div>

                  {inspection.signs && inspection.signs.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Observations</p>
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

                  {inspection.notes && (
                    <div className="pt-3 border-t border-yellow-500/10 bg-black/30 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Notes</p>
                      <p className="text-sm text-white">{inspection.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
