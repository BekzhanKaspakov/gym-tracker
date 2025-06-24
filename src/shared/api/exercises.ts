import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";

const QUERY_KEYS = {
  getExercises: (params?: unknown) => ["exercises", params],
};

const WORKOUT_URI = {
  getExercises: "/api/exercises",
};

export interface Exercise {
  id: string;
  label: string;
  exerciseCategory: string;
}

export const useExercises = () => {
  return useQuery<Exercise[]>({
    queryKey: QUERY_KEYS.getExercises(),
    queryFn: () =>
      axiosInstance.get(WORKOUT_URI.getExercises).then(({ data }) => data),
  });
};
