import { daysInMonth } from "@/shared/utils/daysInMonth";

export const Calendar = () => {
  const today = new Date();
  const daysOfTheMonth = daysInMonth(today);
  console.log(daysOfTheMonth);
  return (
    <div className="">
      <table className="w-full">
        <thead>
          <tr>
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
                const date = daysOfTheMonth[`${week}-${day}`];
                return (
                  <td key={`${day}-${week}`} className="text-center">
                    {date !== undefined && date.getDate()}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
