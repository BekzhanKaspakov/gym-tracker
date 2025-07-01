import { queryClient } from "@/shared/api/query-client";
import {
  useUpdateWorkout,
  WORKOUT_QUERY_KEYS,
  WorkoutRecord,
} from "@/shared/api/workouts";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerFooter,
  Input,
} from "@/shared/ui-kit";
import { format } from "date-fns";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

export const EditSetsDrawer = ({
  selectedWorkout: selectedExercise,
  setSelectedWorkout: setSelectedExercise,
}: {
  selectedWorkout: WorkoutRecord;
  setSelectedWorkout: Dispatch<SetStateAction<WorkoutRecord | null>>;
}) => {
  const updateWorkout = useUpdateWorkout();

  const [exerciseSets, setExerciseSets] = useState<[number, number][]>(
    selectedExercise?.sets ?? [],
  );

  const handleAddSet = () => {
    setExerciseSets([...exerciseSets, [0, 0]]);
  };

  const handleChange = (isWeight: boolean, newValue: number, index: number) => {
    exerciseSets[index][isWeight ? 0 : 1] = newValue;
    setExerciseSets([...exerciseSets]);
  };

  const handleCancel = () => {
    setSelectedExercise(null);
  };

  const handleSubmit = () => {
    if (!selectedExercise) return;
    updateWorkout.mutate(
      {
        ...selectedExercise,
        sets: exerciseSets,
        exerciseId: selectedExercise.exercise.id,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: WORKOUT_QUERY_KEYS.getAllWorkouts(
              format(new Date(selectedExercise.date), "yyyy-MM-dd"),
            ),
          });
          setSelectedExercise(null);
        },
      },
    );
  };

  return (
    <Drawer open={!!selectedExercise} onClose={handleCancel}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm py-4">
          <section className="flex flex-col gap-2">
            <ol className="flex flex-col gap-y-1">
              {exerciseSets.map(([weight, reps], index) => (
                <li key={index} className="flex gap-x-2 items-center">
                  <p className="px-4">{index + 1}</p>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(true, Number(e.target.value), index)
                    }
                  />
                  <Input
                    type="number"
                    value={reps}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleChange(false, Number(e.target.value), index)
                    }
                  />
                </li>
              ))}
              <li className="flex gap-x-2 items-center" onClick={handleAddSet}>
                <p className="px-4">+</p>
                <Button variant="secondary" className="flex-1"></Button>
                <Button variant="secondary" className="flex-1"></Button>
              </li>
            </ol>
          </section>
        </div>
        <DrawerFooter className="flex flex-row">
          <Button variant="outline" className="flex-1" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="default" className="flex-1" onClick={handleSubmit}>
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
