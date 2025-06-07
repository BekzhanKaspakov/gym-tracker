import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

const WORKOUT_URI = {
  editWorkout: (id: string) => `/api/workouts/${id}`,
  postWorkout: "/api/workouts/add",
  getAllWorkouts: "/api/workouts",
};

const QUERY_KEYS = {
  editWorkout: (params?: unknown) => ["workouts-edit", params],
  postWorkout: (params?: unknown) => ["workouts-add", params],
  getAllWorkouts: (params?: unknown) => ["workouts", params],
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

export const useWorkouts = (date: Date) => {
  return useQuery<WorkoutRecord[]>({
    queryKey: QUERY_KEYS.getAllWorkouts(date.toISOString()),
    queryFn: () =>
      axiosInstance
        .get(WORKOUT_URI.getAllWorkouts, {
          params: { date: date.toISOString().substring(0, 10) },
        })
        .then(({ data }) => data),
  });
};
