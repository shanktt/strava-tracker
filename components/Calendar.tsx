import { StravaData, ApiResponse, Activity } from "@/types/types";
import React, { useState, useEffect } from "react";

type CalendarProps = {
  year: number;
  data: Activity[];
  // Add any additional props you might need
};

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

const getEndDate = (year: number): Date => {
  return new Date(year, 11, 31);
};

const Calendar: React.FC<CalendarProps> = ({ year, data }) => {
  const [weeks, setWeeks] = useState<Activity[][]>([]);

  useEffect(() => {
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
    // console.log(calculateWeeks)
    setWeeks(calculateWeeks);
  }, [year, data]);

  const getWeeks = (days: Map<string, Activity>, endDate: Date) => {
    const weeks: Activity[][] = [];
    let week: Activity[] = [];
    for (let day of days.values()) {
      week.push(day);
      if (new Date(day.date).getDay() === 6) {
        // if it's Sunday
        weeks.push(week);
        week = [];
      } else if (day.date === endDate.toISOString().split("T")[0]) {
        // if it's the last day of the year
        weeks.push(week);
      }
    }
    return weeks;
  };

  const renderWeek = (week: Activity[]) => {
    return week.map((day) => (
      <div
        key={day.date}
        style={{
          backgroundColor:
            day.value === 0
              ? "black"
              : `rgba(0, 255, 0, ${day.value / Math.max(...data.map((d) => d.value))})`,
          width: "10px",
          height: "10px",
          margin: "1px",
        }}
      />
    ));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${weeks.length}, 10px)`,
        gridGap: `2px`,
      }}
    >
      {weeks.map((week, idx) => (
        <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
          {renderWeek(week)}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
