"use client";

import { useWorkouts } from "@/shared/api/workouts";
import { Spinner } from "@/shared/ui-kit/spinner";
import { AddWorkoutButton } from "@/widgets/add-workout";
import { Calendar } from "@/widgets/calendar";
import { WorkoutsList } from "@/widgets/workouts-list/ui/workouts-list";
import { useState } from "react";

export const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="h-full flex flex-col pb-5">
      <Calendar selectedDate={selectedDate} onClickDate={setSelectedDate} />
      <WorkoutsList selectedDate={selectedDate} />
      <AddWorkoutButton selectedDate={selectedDate} />
    </div>
  );
};
