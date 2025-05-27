"use client";

import { Calendar } from "@/widgets/calendar";
import { SelectedDayExerciseList } from "@/widgets/selected-day-exercise-list/ui/selected-day-exercise-list";
import { useState } from "react";

export const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <div>
      {/* <Header /> */}
      <Calendar selectedDate={selectedDate} onClickDate={setSelectedDate} />
      <SelectedDayExerciseList />
    </div>
  );
};
