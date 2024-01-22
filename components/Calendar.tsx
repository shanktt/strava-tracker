import { Activity } from "@/types/types";
import React, { useState, useEffect } from "react";

type CalendarProps = {
  year: number;
  data: Activity[];
  loading: boolean;
};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getEndDate = (year: number): Date => {
  return new Date(year, 11, 31);
};

const colors = ["#383838", "#FFDCCB", "#FFC2A4", "#FF8E55", "#FF5C0A"];

const Calendar: React.FC<CalendarProps> = ({ year, data, loading }) => {
  const [weeks, setWeeks] = useState<Activity[][]>([]);
  const [totalMiles, setTotalMiles] = useState<string>("0");

  useEffect(() => {
    const totalMeters = data.reduce((acc, curr) => acc + curr.count, 0);
    setTotalMiles(totalMeters.toFixed(2));

    // Initialize a Map with all days of the year
    const daysInYear = isLeapYear(year) ? 366 : 365;
    const date = new Date(year, 0, 1);
    const days = new Map<string, Activity>();

    for (let i = 0; i < daysInYear; i++) {
      const dateString = date.toISOString().split("T")[0];
      days.set(dateString, { date: dateString, count: 0, value: 0 });
      date.setDate(date.getDate() + 1);
    }

    // Fill the Map with the provided data
    data.forEach((day) => {
      days.set(day.date, day);
    });

    const endDate = getEndDate(year);
    const calculateWeeks = getWeeks(days, endDate);
    setWeeks(calculateWeeks);
  }, [year, data]);

  const getWeeks = (days: Map<string, Activity>, endDate: Date) => {
    const weeks: Activity[][] = [];
    let week: Activity[] = [];
    for (let day of days.values()) {
      week.push(day);
      if (new Date(day.date).getDay() === 5) {
        // if it's Saturday
        weeks.push(week);
        week = [];
      } else if (day.date === endDate.toISOString().split("T")[0]) {
        // if it's the last day of the year
        weeks.push(week);
      }
    }

    if (weeks[0].length < 7) {
      // Pad the first week with days from the previous year
      // If the current year doesn't start on Monday

      const daysNeeded = 7 - weeks[0].length;
      const prevYear = year - 1;
      const lastDayPrevYear = new Date(prevYear, 11, 31);
      for (let i = 0; i < daysNeeded; i++) {
        const date = new Date(lastDayPrevYear);
        date.setDate(lastDayPrevYear.getDate() - i);
        const dateString = date.toISOString().split("T")[0];
        const activity: Activity = {
          date: dateString,
          count: 0,
          value: 0,
          isPadded: true,
        };
        weeks[0].unshift(activity);
      }
    }
    return weeks;
  };

  const renderWeek = (week: Activity[]) => {
    return week.map((day, idx) => (
      <div key={idx} className="has-tooltip relative">
        {loading ? null : (
          <div className="arrow-down tooltip absolute bg-gray-400 rounded text-xs -mt-8 p-1 whitespace-nowrap transform -translate-x-[45%]">
            {day.count.toFixed(2)} miles on {day.date}
          </div>
        )}
        <div
          key={day.date}
          className={`w-[0.3rem] h-[0.3rem] md:w-[0.8rem] md:h-[0.8rem] lg:w-[0.9rem] lg:h-[0.9rem] min-[1099px]:w-4 min-[1099px]:h-4 mb-0.5 md:mb-1 rounded-sm ${loading ? `pulsing-column` : ""}`}
          style={{
            backgroundColor: day.isPadded ? "transparent" : colors[day.value],
            animationDelay: loading ? `${idx * 0.1}s` : "0s",
          }}
        />
      </div>
    ));
  };

  return (
    <div className="flex flex-col overflow-hidden">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${weeks.length}, auto)`,
          // columnGap: "0.5rem",
        }}
      >
        {weeks.map((week, idx) => (
          <div key={idx} className={`col-${idx.toString()} flex flex-col mr-[0.08rem] md:mr-[0.08rem] lg:mr-1 min-[1099px]:mr-1`}>
            {renderWeek(week)}
          </div>  
        ))}
      </div>
      {!loading ? (
        <div className="flex flex-row justify-between">
          <div>Total: {totalMiles}</div>
          <div className="flex flex-row space-x-2">
            <div>Less</div>
            <div className="flex flex-row space-x-1 items-center">
              {colors.map((color, idx) => (
                <div
                  key={`color-${idx}`}
                  className="w-4 h-4 rounded-sm"
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
            <div>More</div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Calendar;
