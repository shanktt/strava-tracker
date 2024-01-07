import React, { useEffect, useState } from 'react';
import Button from '@/components/login-btn'
import { StravaData, ApiResponse } from '@/types/types'
import ActivityCalendar from 'react-activity-calendar';

const shades: Array<[number, string, number]> = [
  [0.25, "#FE8548", 1],
  [0.5, "#FE6A20", 2],
  [0.75, "#F25301", 3],
  [1.0, "#B73E01", 4],
]

interface DateDistanceBins {
  [key: string]: number;
}

type Activity = {
  date: string;
  count: number;
  level: number;
};


export default function Home() {
  const [dailyData, setDistances] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  function binData(data: StravaData[]): Activity[] {
    const bins = data.reduce((acc, d) => {
      const date = new Date(d.start_date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += d.distance;

      return acc;
    }, {} as DateDistanceBins);

    const dailyData: Activity[] = [];
    const maxDistance = Math.max(...Object.values(bins))
    console.log(maxDistance);
    Object.keys(bins).forEach((key) => {
      const distance = bins[key];
      const normalizedDistance = distance / maxDistance;
      for (const [threshold, color, level] of shades) {
        if (normalizedDistance <= threshold) {
          const newLevel = distance === 0 ? 0 : level;
          console.log("distance: ", distance, normalizedDistance, newLevel)
          dailyData.push({"date": key, "count": distance, "level": newLevel});
          break;
        }
      }
    }) 

    return dailyData.reverse();
  }


  async function callApi() {
    fetch("api/hello")
    .then(response => response.json())
    .then((data: ApiResponse) => {
      if ('error' in data) {
        setError(data.error)
      } else {
        const DateDistanceBins = binData(data);
        setDistances(DateDistanceBins);
      }
    }).catch(eror => {
      console.error('Fetch error:', error);
      setError('Failed to load data');
    })
  }

  return (
    <div>
    <Button/>
    <div/>
    <button onClick={() => callApi()}>API</button>
    <div>
      <ActivityCalendar data={dailyData} weekStart={1} showWeekdayLabels maxLevel={4}
        eventHandlers={{
          onClick: (event) => (activity) => {
            alert(JSON.stringify(activity));
          },
        }}
        theme={{
          light: ["#383838", "#FFDCCB", "#FFC2A4", "#FF8E55", "#FF5C0A",],
          dark:  ["#383838", "#FFDCCB", "#FFC2A4", "#FF8E55", "#FF5C0A",]
        }}
      ></ActivityCalendar>
    </div>
    </div>
  )
}
