import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui-kit/accordion";
import { Button } from "@/shared/ui-kit/button/ui/button";
import Image from "next/image";
import { WorkoutsListProps } from "../lib/types";
import { EditSetsDrawer } from "@/widgets/edit-sets";
import { useState } from "react";
import {
  useDeleteWorkout,
  useWorkouts,
  WORKOUT_QUERY_KEYS,
  WorkoutRecord,
} from "@/shared/api/workouts";
import { Spinner } from "@/shared/ui-kit/spinner";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import { queryClient } from "@/shared/api/query-client";
import { format } from "date-fns";

export const WorkoutsList = ({ selectedDate }: WorkoutsListProps) => {
  const deleteWorkout = useDeleteWorkout();

  const { data: workouts, isLoading } = useWorkouts(selectedDate);

  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRecord | null>(
    null,
  );

  const onDeleteWorkout = (workoutId: string) => {
    deleteWorkout.mutate(workoutId, {
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: WORKOUT_QUERY_KEYS.getAllWorkouts(
            format(selectedDate, "yyyy-MM-dd"),
          ),
        });
        queryClient.invalidateQueries({
          queryKey: WORKOUT_QUERY_KEYS.getMonthlySummary(
            `${selectedDate.getUTCMonth()} ${selectedDate.getUTCFullYear()}`,
          ),
        });
      },
    });
  };

  const trailingActions = (workoutId: string) => (
    <TrailingActions>
      <SwipeAction
        destructive={true}
        onClick={() => onDeleteWorkout(workoutId)}
      >
        <div className="bg-destructive text-primary-foreground flex justify-center items-center p-4">
          Delete
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <section className="flex flex-col gap-y-1 flex-1">
      <SwipeableList>
        {workouts?.map((x) => (
          <SwipeableListItem key={x.id} trailingActions={trailingActions(x.id)}>
            <Accordion type="single" collapsible className="px-6 w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="py-3 items-center">
                  <div className="flex gap-x-5 items-center">
                    <Image
                      width={40}
                      height={40}
                      src={`/icons/${x.exercise.exerciseCategory}.png`}
                      alt={x.exercise.exerciseCategory}
                    />
                    <h3>{x.exercise.label}</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="flex flex-col gap-y-1">
                    {x.sets.length > 0 ? (
                      x.sets.map(([weight, reps], index) => (
                        <li
                          key={`${x.id}-${index}`}
                          className="flex gap-x-2 items-center"
                          onClick={() => setSelectedWorkout(x)}
                        >
                          <p className="px-4">{index + 1}</p>
                          <Button variant="secondary" className="flex-1">
                            {weight}
                          </Button>
                          <Button variant="secondary" className="flex-1">
                            {reps}
                          </Button>
                        </li>
                      ))
                    ) : (
                      <li
                        className="flex gap-x-2 items-center"
                        onClick={() => setSelectedWorkout(x)}
                      >
                        <p className="px-4">+</p>
                        <Button variant="secondary" className="flex-1"></Button>
                        <Button variant="secondary" className="flex-1"></Button>
                      </li>
                    )}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </SwipeableListItem>
        ))}
      </SwipeableList>
      {selectedWorkout && (
        <EditSetsDrawer
          selectedWorkout={selectedWorkout}
          setSelectedWorkout={setSelectedWorkout}
        />
      )}
    </section>
  );
};
