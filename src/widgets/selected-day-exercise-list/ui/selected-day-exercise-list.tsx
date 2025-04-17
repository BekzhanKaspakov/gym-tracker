import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui-kit/accordion";
import { Button } from "@/shared/ui-kit/button/ui/button";
import Image from "next/image";

interface ExerciseCategory {
  id: string;
  name: string;
  icon: IconName;
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

type IconName = "back" | "chest" | "shoulder" | "quadriceps" | "arm";

export const SelectedDayExerciseList = () => {
  const exerciseRecords: ExerciseRecord[] = [
    {
      id: "5",
      dateTime: "2023-03-01T12:00:00",
      exercise: {
        id: "5",
        name: "Bench Press",
        category: {
          id: "5",
          name: "Upper Body",
          icon: "back",
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
    {
      id: "1",
      dateTime: "2023-03-01T12:00:00",
      exercise: {
        id: "1",
        name: "Bench Press",
        category: {
          id: "1",
          name: "Upper Body",
          icon: "chest",
        },
      },
      sets: [],
    },
    {
      id: "2",
      dateTime: "2023-03-01T12:00:00",
      exercise: {
        id: "2",
        name: "Bench Press",
        category: {
          id: "2",
          name: "Upper Body",
          icon: "arm",
        },
      },
      sets: [],
    },
    {
      id: "3",
      dateTime: "2023-03-01T12:00:00",
      exercise: {
        id: "3",
        name: "Bench Press",
        category: {
          id: "3",
          icon: "shoulder",
          name: "Upper Body",
        },
      },
      sets: [],
    },
    {
      id: "4",
      dateTime: "2023-03-01T12:00:00",
      exercise: {
        id: "4",
        name: "Bench Press",
        category: {
          id: "4",
          name: "Upper Body",
          icon: "quadriceps",
        },
      },
      sets: [],
    },
  ];

  return (
    <section className="flex flex-col gap-y-1">
      {exerciseRecords.map((x) => (
        <div key={x.id} className="px-6 w-full">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="py-3">
                <div className="flex gap-x-5 items-center">
                  <Image
                    width={40}
                    height={40}
                    src={`/icons/${x.exercise.category.icon}.png`}
                    alt={x.exercise.category.icon}
                  />
                  <h3>{x.exercise.name}</h3>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ol className="flex flex-col gap-y-1">
                  {x.sets.map((y, index) => (
                    <li
                      key={`${x.id}-${index}`}
                      className="flex gap-x-2 items-center"
                    >
                      <p className="px-4">{index + 1}</p>
                      <Button variant="secondary" className="flex-1">
                        {y.weight}
                      </Button>
                      <Button variant="secondary" className="flex-1">
                        {y.reps}
                      </Button>
                    </li>
                  ))}
                  {x.sets.length === 0 && (
                    <li className="flex gap-x-2 items-center">
                      <p className="px-4">1</p>
                      <Button variant="secondary" className="flex-1"></Button>
                      <Button variant="secondary" className="flex-1"></Button>
                    </li>
                  )}
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </section>
  );
};
