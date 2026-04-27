import { z } from "zod";

export const inspectionSchema = z.object({
  hiveId: z.string().min(1, "Please select a hive"),
  date: z.string().min(1, "Date is required"),
  inspector: z.string().min(2, "Inspector name must be at least 2 characters"),
  queenSeen: z.boolean(),
  broodPattern: z.enum(["excellent", "good", "poor"] as const, {
    message: "Please select a brood pattern",
  }),
  temperament: z.enum(["calm", "normal", "aggressive"] as const, {
    message: "Temperament must be one of 'calm', 'normal', or 'aggressive'",
  }),
  signs: z.array(z.string()).default([]),
  notes: z.string().min(10, "Notes must be at least 10 characters"),
});

export type InspectionFormData = z.infer<typeof inspectionSchema>;
