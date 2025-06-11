"use client";

import { useMonthlySummary } from "@/shared/api/workouts";
import { H3, P } from "@/shared/ui-kit/typography";
import { classNames } from "@/shared/utils/classNames";
import { daysInMonth } from "@/shared/utils/daysInMonth";
import { getMonthName } from "@/shared/utils/getMonthName";
import { useRef, useState } from "react";

const getMonthDate = (baseDate: Date, offset: number) => {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() + offset);
  return date;
};

export const Calendar = ({
  selectedDate,
  onClickDate,
}: {
  selectedDate: Date;
  onClickDate: (newDate: Date) => void;
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const { data: summary, isLoading } = useMonthlySummary(selectedDate);

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current !== null) {
      const delta = e.touches[0].clientX - startX.current;
      setDragX(delta);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (Math.abs(dragX) > 50) {
      setCurrentMonth((prev) => {
        const newMonth = new Date(prev);
        newMonth.setMonth(newMonth.getMonth() + (dragX < 0 ? 1 : -1));
        return newMonth;
      });
    }

    // Reset drag position
    setDragX(0);
    startX.current = null;
  };

  const months = [-1, 0, 1].map((offset) =>
    daysInMonth(getMonthDate(currentMonth, offset)),
  );

  return (
    <>
      <header className="p-4 pb-0 font-bold">
        <H3>{getMonthName(currentMonth)}</H3>
      </header>
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="overflow-hidden relative w-full shadow-lg rounded-xl p-2 pb-6 mb-6"
      >
        <div
          className={classNames(
            "flex transition-transform duration-300 ease-in-out",
            { "transition-none": isDragging },
          )}
          style={{
            transform: `translateX(calc(${-100 * 1}% + ${dragX}px))`,
            width: "100%",
          }}
        >
          {months.map((monthDays, idx) => (
            <table
              key={idx}
              className="w-full flex-shrink-0"
              style={{ width: "100%" }}
            >
              <thead>
                <tr className="font-normal" style={{ color: "#CACACA" }}>
                  <th scope="col">Mon</th>
                  <th scope="col">Tue</th>
                  <th scope="col">Wed</th>
                  <th scope="col">Thu</th>
                  <th scope="col">Fri</th>
                  <th scope="col">Sat</th>
                  <th scope="col">Sun</th>
                </tr>
              </thead>
              <tbody>
                {[0, 1, 2, 3, 4].map((week) => (
                  <tr key={week}>
                    {[1, 2, 3, 4, 5, 6, 0].map((day) => {
                      const date = monthDays[`${week}-${day}`];
                      return (
                        <td
                          key={`${day}-${week}`}
                          className={classNames(
                            "text-center size-12 font-bold relative pb-2",
                            {
                              "bg-secondary text-secondary-foreground rounded-xl":
                                date?.getDate() === new Date().getDate() &&
                                date?.getMonth() === new Date().getMonth() &&
                                date?.getFullYear() ===
                                  new Date().getFullYear(),
                              "bg-primary text-primary-foreground rounded-xl":
                                date?.getDate() === selectedDate.getDate() &&
                                date?.getMonth() === selectedDate.getMonth() &&
                                date?.getFullYear() ===
                                  selectedDate.getFullYear(),
                            },
                          )}
                          onClick={() => onClickDate(date)}
                        >
                          <P>{date?.getDate().toString()}</P>
                          {summary?.[`${date?.getDate()}`] && (
                            <p className="absolute bottom-0 m-auto left-0 right-0">
                              •
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
    </>
  );
};
