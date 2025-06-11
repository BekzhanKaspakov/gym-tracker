"use client";

import { useWorkouts } from "@/shared/api/workouts";
import { Spinner } from "@/shared/ui-kit/spinner";
import { Calendar } from "@/widgets/calendar";
import { WorkoutsList } from "@/widgets/workouts-list/ui/workouts-list";
import { useState } from "react";

export const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: workouts, isLoading } = useWorkouts(selectedDate);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <Calendar
        selectedDate={selectedDate}
        onClickDate={(date) => {
          setSelectedDate(date);
          console.log(date);
        }}
      />
      <WorkoutsList workouts={workouts ?? []} />
    </div>
  );
};
