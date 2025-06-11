import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

const WORKOUT_URI = {
  editWorkout: (id: string) => `/api/workouts/${id}`,
  postWorkout: "/api/workouts/add",
  getAllWorkouts: "/api/workouts",
  getMonthlySummary: "/api/workouts/summary",
};

const QUERY_KEYS = {
  editWorkout: (params?: unknown) => ["workouts-edit", params],
  postWorkout: (params?: unknown) => ["workouts-add", params],
  getAllWorkouts: (params?: unknown) => ["workouts", params],
  getMonthlySummary: (params?: unknown) => ["monthly-summary", params],
};

export interface Exercise {
  id: string;
  label: string;
  exerciseCategory: string;
}

export interface WorkoutRecord {
  id: string;
  date: string;
  exercise: Exercise;
  sets: [number, number][];
}

export interface MonthlySummary {
  [day: number]: boolean;
}

export const useWorkouts = (date: Date) => {
  return useQuery<WorkoutRecord[]>({
    queryKey: QUERY_KEYS.getAllWorkouts(date.toISOString()),
    queryFn: () =>
      axiosInstance
        .get(WORKOUT_URI.getAllWorkouts, {
          params: { date: format(new Date(date), "yyyy-MM-dd") },
        })
        .then(({ data }) => data),
  });
};

export const useMonthlySummary = (date: Date) => {
  console.log(format(new Date(date), "yyyy-MM-dd"));
  return useQuery<MonthlySummary>({
    queryKey: QUERY_KEYS.getMonthlySummary(
      `${date.getUTCMonth()} ${date.getUTCFullYear()}`,
    ),
    queryFn: () =>
      axiosInstance
        .get(WORKOUT_URI.getMonthlySummary, {
          params: { date: format(new Date(date), "yyyy-MM-dd") },
        })
        .then(({ data }) => data),
  });
};
