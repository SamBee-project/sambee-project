import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Hive, Inspection, Alert } from "../../types";
interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Hives", "Inspections", "Alerts", "User"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, any>({
      query: (credentials) => {
        const bodyFormData = new FormData();
        bodyFormData.append("username", credentials.email);
        bodyFormData.append("password", credentials.password);

        return {
          url: "auth/jwt/login",
          method: "POST",
          body: bodyFormData,
        };
      },
    }),

    register: builder.mutation({
      query: (newUser) => ({
        url: "auth/register",
        method: "POST",
        body: newUser,
      }),
    }),

    getHives: builder.query<Hive[], void>({
      query: () => "/api/v1/hives",
      transformResponse: (response: any) => {
        return Array.isArray(response)
          ? response
          : response.hives || response.data || [];
      },
      providesTags: ["Hives"],
    }),

    getHive: builder.query<Hive, string>({
      query: (id) => `/hives/${id}`,
      providesTags: (result, error, id) => [{ type: "Hives", id }],
    }),

    getInspections: builder.query<Inspection[], string | void>({
      query: (hiveId) =>
        hiveId ? `/inspections?hiveId=${hiveId}` : "/inspections",
      providesTags: ["Inspections"],
    }),

    createInspection: builder.mutation<
      Inspection,
      Omit<Inspection, "id" | "hiveName">
    >({
      query: (newInspection) => ({
        url: "/inspections",
        method: "POST",
        body: newInspection,
      }),
      invalidatesTags: ["Inspections", "Hives"],
    }),

    getAlerts: builder.query<Alert[], void>({
      query: () => "/alerts",
      providesTags: ["Alerts"],
    }),

    dismissAlert: builder.mutation<void, string>({
      query: (alertId) => ({
        url: `/alerts/${alertId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Alerts"],
    }),

    getTemperatureHistory: builder.query<any, void>({
      query: () => "/stats/temperature",
    }),

    getHoneyProductionHistory: builder.query<any, void>({
      query: () => "/stats/honey",
    }),
  }),
});

export const {
  useLoginMutation,
  useGetHivesQuery,
  useGetHiveQuery,
  useGetInspectionsQuery,
  useCreateInspectionMutation,
  useGetAlertsQuery,
  useDismissAlertMutation,
  useGetTemperatureHistoryQuery,
  useGetHoneyProductionHistoryQuery,
  useRegisterMutation,
} = apiSlice;
