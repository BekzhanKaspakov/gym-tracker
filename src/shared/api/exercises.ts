import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../axios";
import { AxiosError } from "axios";
import { queryClient } from "./query-client";

const QUERY_KEYS = {
  getExercises: (params?: unknown) => ["exercises", params],
};

const EXERCISE_URI = {
  getExercises: "/api/exercises",
  addExercise: "/api/exercises/add"
};

export interface Exercise {
  id: string;
  label: string;
  exerciseCategory: string;
}

export interface AddExerciseRequest extends Omit<Exercise, "id"> {
}

export const useExercises = () => {
  return useQuery<Exercise[]>({
    queryKey: QUERY_KEYS.getExercises(),
    queryFn: () =>
      axiosInstance.get(EXERCISE_URI.getExercises).then(({ data }) => data),
  });
};

export const useAddExercise = () => {
  return useMutation<Exercise, AxiosError, AddExerciseRequest>({
    mutationFn: (body: AddExerciseRequest) =>
      axiosInstance
        .post(EXERCISE_URI.addExercise, body)
        .then(({ data }) => data),
    throwOnError: false,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getExercises() })

  });
}
