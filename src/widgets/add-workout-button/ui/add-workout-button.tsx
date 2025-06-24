import { Button } from "@/shared/ui-kit";
import { classNames } from "@/shared/utils/classNames";
import { AddWorkoutDrawer } from "@/widgets/add-workout";
import { format } from "date-fns";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

export const AddWorkoutButton = ({
  className,
  selectedDate,
}: {
  selectedDate: Date;
  className?: string;
}) => {
  const formattedDate = format(selectedDate, "2006-02-15");
  return (
    <section className={classNames("flex gap-4 mx-4", className)}>
      <Button variant="secondary" className="rounded-[50%]">
        <Ellipsis />
      </Button>
      <AddWorkoutDrawer date={selectedDate} />
    </section>
  );
};
