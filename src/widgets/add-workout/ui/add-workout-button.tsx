import { Button } from "@/shared/ui-kit";
import { classNames } from "@/shared/utils/classNames";
import { AddWorkoutDrawer } from "@/widgets/add-workout";
import { Ellipsis } from "lucide-react";

export const AddWorkoutButton = ({
  className,
  selectedDate,
}: {
  selectedDate: Date;
  className?: string;
}) => {
  return (
    <section className={classNames("flex gap-4 mx-4", className)}>
      <Button variant="secondary" className="rounded-[50%]">
        <Ellipsis />
      </Button>
      <AddWorkoutDrawer date={selectedDate} />
    </section>
  );
};
