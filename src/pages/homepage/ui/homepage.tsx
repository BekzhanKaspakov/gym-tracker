import { Calendar } from "@/widgets/calendar";
import { SelectedDayExerciseList } from "@/widgets/selected-day-exercise-list/ui/selected-day-exercise-list";

export const HomePage = () => {
  return (
    <div>
      {/* <Header /> */}
      <Calendar />
      <SelectedDayExerciseList />
    </div>
  );
};
