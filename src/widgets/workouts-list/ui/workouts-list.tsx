import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui-kit/accordion";
import { Button } from "@/shared/ui-kit/button/ui/button";
import Image from "next/image";
import { WorkoutsListProps } from "../lib/types";

export const WorkoutsList = ({ workouts }: WorkoutsListProps) => {
  return (
    <section className="flex flex-col gap-y-1 flex-1">
      {workouts.map((x) => (
        <div key={x.id} className="px-6 w-full">
          <Accordion type="single" collapsible>
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
                  {x.sets.map(([weight, reps], index) => (
                    <li
                      key={`${x.id}-${index}`}
                      className="flex gap-x-2 items-center"
                    >
                      <p className="px-4">{index + 1}</p>
                      <Button variant="secondary" className="flex-1">
                        {weight}
                      </Button>
                      <Button variant="secondary" className="flex-1">
                        {reps}
                      </Button>
                    </li>
                  ))}
                  <li className="flex gap-x-2 items-center">
                    <p className="px-4">{x.sets.length + 1}</p>
                    <Button variant="secondary" className="flex-1"></Button>
                    <Button variant="secondary" className="flex-1"></Button>
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </section>
  );
};
