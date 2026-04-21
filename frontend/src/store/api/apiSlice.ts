import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Hive, Inspection, Alert } from "../../types";
import {
  mockHives,
  mockInspections,
  mockAlerts,
  temperatureHistory,
  honeyProductionHistory,
} from "../../data/mockData";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let hives = [...mockHives];
let inspections = [...mockInspections];
let alerts = [...mockAlerts];

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Hives", "Inspections", "Alerts"],
  endpoints: (builder) => ({
    getHives: builder.query<Hive[], void>({
      queryFn: async () => {
        await delay(300);
        return { data: hives };
      },
      providesTags: ["Hives"],
    }),

    getHive: builder.query<Hive, string>({
      queryFn: async (id) => {
        await delay(200);
        const hive = hives.find((h) => h.id === id);
        if (!hive) {
          return { error: { status: 404, data: "Hive not found" } };
        }
        return { data: hive };
      },
      providesTags: (result, error, id) => [{ type: "Hives", id }],
    }),

    getInspections: builder.query<Inspection[], string | void>({
      queryFn: async (hiveId) => {
        await delay(200);
        const filtered = hiveId
          ? inspections.filter((i) => i.hiveId === hiveId)
          : inspections;
        return { data: filtered };
      },
      providesTags: ["Inspections"],
    }),

    createInspection: builder.mutation<
      Inspection,
      Omit<Inspection, "id" | "hiveName">
    >({
      queryFn: async (newInspection) => {
        await delay(400);
        const hive = hives.find((h) => h.id === newInspection.hiveId);
        if (!hive) {
          return { error: { status: 404, data: "Hive not found" } };
        }

        const inspection: Inspection = {
          id: String(Date.now()),
          hiveName: hive.name,
          ...newInspection,
        };

        inspections = [inspection, ...inspections];

        hives = hives.map((h) =>
          h.id === newInspection.hiveId
            ? { ...h, lastInspection: newInspection.date }
            : h,
        );

        return { data: inspection };
      },
      invalidatesTags: ["Inspections", "Hives"],
    }),

    getAlerts: builder.query<Alert[], void>({
      queryFn: async () => {
        await delay(200);
        return { data: alerts };
      },
      providesTags: ["Alerts"],
    }),

    dismissAlert: builder.mutation<string, string>({
      queryFn: async (alertId) => {
        await delay(200);
        alerts = alerts.filter((a) => a.id !== alertId);
        return { data: alertId };
      },
      invalidatesTags: ["Alerts"],
    }),

    getTemperatureHistory: builder.query<typeof temperatureHistory, void>({
      queryFn: async () => {
        await delay(300);
        return { data: temperatureHistory };
      },
    }),

    getHoneyProductionHistory: builder.query<
      typeof honeyProductionHistory,
      void
    >({
      queryFn: async () => {
        await delay(300);
        return { data: honeyProductionHistory };
      },
    }),
  }),
});

export const {
  useGetHivesQuery,
  useGetHiveQuery,
  useGetInspectionsQuery,
  useCreateInspectionMutation,
  useGetAlertsQuery,
  useDismissAlertMutation,
  useGetTemperatureHistoryQuery,
  useGetHoneyProductionHistoryQuery,
} = apiSlice;
