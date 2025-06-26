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
  DrawerHeader,
  DrawerTrigger,
} from "@/shared/ui-kit";
import { groupBy } from "@/shared/utils/groupBy";

import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
const categories = ["Arm", "Back", "Chest", "Quadriceps", "Shoulder"];

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
      date: date.toISOString(),
      exerciseId: exercise.id,
      sets: [],
    };
    addExercise.mutate(payload, {
      onSuccess: () => {
        setIsOpen(false);
        queryClient.invalidateQueries({
          queryKey: WORKOUT_QUERY_KEYS.getAllWorkouts(date.toISOString()),
        });
      },
    });
  };

  return (
    <Drawer onClose={handleClear} open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="flex-1">Add more</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            {/* <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          <section className="flex flex-col gap-2">
            {selectedCategory
              ? exerciseByCategory[selectedCategory].map((exercise) => (
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
              : categories.map((category) => (
                  <Button
                    key={category}
                    className="flex justify-between"
                    variant="outline"
                    size="xl"
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
            {/* <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose> */}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
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
