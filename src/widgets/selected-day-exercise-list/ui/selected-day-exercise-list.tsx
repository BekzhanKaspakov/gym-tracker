import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui-kit/accordion";

interface ExerciseCategory {
  id: string;
  name: string;
}

interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
}

interface ExerciseSet {
  weight: number;
  reps: number;
}

interface ExerciseRecord {
  id: string;
  dateTime: string;
  exercise: Exercise;
  sets: ExerciseSet[];
}

export const SelectedDayExerciseList = () => {
  const exerciseRecords: ExerciseRecord[] = [
    {
      id: "1",
      dateTime: "2023-03-01T12:00:00",
      exercise: {
        id: "1",
        name: "Bench Press",
        category: {
          id: "1",
          name: "Upper Body",
        },
      },
      sets: [
        {
          weight: 100,
          reps: 10,
        },
        {
          weight: 120,
          reps: 8,
        },
      ],
    },
  ];

  return (
    <section>
      {exerciseRecords.map((x) => (
        <Accordion key={x.id} type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>{x.exercise.name}</AccordionTrigger>
            <AccordionContent>
              <ol>
                {x.sets.map((y, index) => (
                  <li key={`${x.id}-${index}`}>
                    <div>{y.weight} kg</div>
                    <div>{y.reps} kg</div>
                  </li>
                ))}
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </section>
  );
};
