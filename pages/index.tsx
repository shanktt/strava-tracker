import React, { useEffect, useState } from 'react';
import Button from '@/components/login-btn'
import { Activity, ApiResponse } from '@/types/types'
import ActivityCalendar from 'react-activity-calendar';

// interface DateDistanceBins {
//   totalDistance: number
//   date: Date
//   // colorCode: string
// }

const shades: Array<[number, string, number]> = [
  [0.25, "#FE8548", 1],
  [0.5, "#FE6A20", 2],
  [0.75, "#F25301", 3],
  [1.0, "#B73E01", 4],
]

interface DateDistanceBins {
  [key: string]: number;
}

type DailyData = {
  date: string;
  count: number;
  level: number;
  // distance: number;
  // color: string;
};


export default function Home() {
  const [dailyData, setDistances] = useState<DailyData[]>([]);
  const [error, setError] = useState<string | null>(null);

  function binData(data: Activity[]): DailyData[] {
    const bins = data.reduce((acc, d) => {
      const date = new Date(d.start_date).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += d.distance;

      return acc;
    }, {} as DateDistanceBins);

    const dailyData: DailyData[] = [];
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

    return [...dailyData].reverse();
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
        //console.log(DateDistanceBins)
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
          onMouseEnter: (event) => (activity) => {
            console.log('on mouse enter');
          },
        }}
        theme={{
          light: ["#383838", "#FFDCCB", "#FFC2A4", "#FF8E55", "#FF5C0A",],// "#B33E00"],
          dark:  ["#383838", "#FFDCCB", "#FFC2A4", "#FF8E55", "#FF5C0A",]// "#B33E00"]
        }}
      ></ActivityCalendar>
    </div>
    </div>
  )
}
