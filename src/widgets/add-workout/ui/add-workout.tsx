"use client";

import { Exercise, useExercises } from "@/shared/api/exercises";
import { queryClient } from "@/shared/api/query-client";
import {
  AddWorkoutRequest,
  useAddWorkout,
  WORKOUT_QUERY_KEYS,
} from "@/shared/api/workouts";
import {
  Button,
  P,
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/shared/ui-kit";
import { groupBy } from "@/shared/utils/groupBy";
import { format } from "date-fns";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AddExercise } from "./add-exercise";
import { CATEGORIES } from "@/shared/constants/common";

export function AddWorkoutDrawer({ date }: { date: Date }) {
  const addExercise = useAddWorkout();

  const { data: exercises } = useExercises();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const exerciseByCategory = useMemo(
    () => groupBy(exercises ?? [], (i) => i.exerciseCategory),
    [exercises],
  );

  const handleClear = () => {
    setSelectedCategory(null);
  };

  const handleAddWorkout = (exercise: Exercise) => {
    const payload: AddWorkoutRequest = {
      date: format(date, "yyyy-MM-dd\'T\'HH:mm:ss\'.000Z\'"),
      exerciseId: exercise.id,
      sets: [],
    };
    addExercise.mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        setSelectedCategory(null)
        queryClient.invalidateQueries({
          queryKey: WORKOUT_QUERY_KEYS.getAllWorkouts(
            format(date, "yyyy-MM-dd"),
          ),
        });
        queryClient.invalidateQueries({
          queryKey: WORKOUT_QUERY_KEYS.getMonthlySummary(
            `${date.getUTCMonth()} ${date.getUTCFullYear()}`,
          ),
        });
      },
    });
  };

  return (
    <>
      <Drawer onClose={handleClear} open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
          <Button className="flex-1">Add more</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <section className="flex flex-col gap-2">
              {selectedCategory
                ? exerciseByCategory[selectedCategory]?.map((exercise) => (
                  <Button
                    key={exercise.id}
                    className="flex justify-between"
                    variant="outline"
                    size="xl"
                    onClick={() => handleAddWorkout(exercise)}
                  >
                    <P>{exercise.label}</P>
                  </Button>
                ))
                : CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    className="flex justify-between"
                    variant="outline"
                    size="xl"
                    disabled={exerciseByCategory[category] == undefined}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <P>{category}</P>
                    <div className="flex gap-2 items-center">
                      <ExerciseCount
                        exercises={exercises}
                        exerciseCategory={category}
                      />
                      <ArrowRight />
                    </div>
                  </Button>
                ))}
            </section>
            <DrawerFooter>
              <AddExercise />
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

const ExerciseCount = ({
  exercises,
  exerciseCategory,
}: {
  exercises?: Exercise[];
  exerciseCategory: string;
}) => {
  const exerciseCount =
    exercises?.filter((x) => x.exerciseCategory === exerciseCategory).length ??
    0;
  if (exerciseCount === 0) {
    return null;
  }
  return exerciseCount;
};
