import { format } from "date-fns";
import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { Exercise } from "./exercises";
import { AxiosError } from "axios";
import { queryClient } from "./query-client";

const WORKOUT_URI = {
  editWorkout: (id: string) => `/api/workouts/${id}`,
  postWorkout: "/api/workouts/add",
  getAllWorkouts: "/api/workouts",
  getMonthlySummary: "/api/workouts/summary",
};

export const WORKOUT_QUERY_KEYS = {
  editWorkout: (params?: unknown) => ["workouts-edit", params],
  postWorkout: (params?: unknown) => ["workouts-add", params],
  getAllWorkouts: (params?: unknown) => ["workouts", params],
  getMonthlySummary: (params?: unknown) => ["monthly-summary", params],
};

export interface WorkoutRecord {
  id: string;
  date: string;
  exercise: Exercise;
  sets: [number, number][];
}

export interface MonthlySummary {
  [day: number]: boolean;
}

export interface AddWorkoutRequest
  extends Omit<WorkoutRecord, "id" | "exercise"> {
  exerciseId: string;
}

export interface UpdateWorkoutRequest extends Omit<WorkoutRecord, "exercise"> {
  exerciseId: string;
}

export const useWorkouts = (date: Date) => {
  return useQuery<WorkoutRecord[]>({
    queryKey: WORKOUT_QUERY_KEYS.getAllWorkouts(format(date, "yyyy-MM-dd")),
    queryFn: () =>
      axiosInstance
        .get(WORKOUT_URI.getAllWorkouts, {
          params: { date: format(new Date(date), "yyyy-MM-dd") },
        })
        .then(({ data }) => data),
  });
};

export const useMonthlySummary = (date: Date) => {
  return useQuery<MonthlySummary>({
    queryKey: WORKOUT_QUERY_KEYS.getMonthlySummary(
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

export const useAddWorkout = () => {
  return useMutation<WorkoutRecord, AxiosError, AddWorkoutRequest>({
    mutationFn: (body: AddWorkoutRequest) =>
      axiosInstance
        .post(WORKOUT_URI.postWorkout, body)
        .then(({ data }) => data),
    throwOnError: false,
  });
};

export const useUpdateWorkout = () => {
  return useMutation<WorkoutRecord, AxiosError, UpdateWorkoutRequest>({
    mutationFn: (body: UpdateWorkoutRequest) =>
      axiosInstance
        .patch(WORKOUT_URI.editWorkout(body.id), body)
        .then(({ data }) => data),
    throwOnError: false,
  });
};
