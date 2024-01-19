import React, { useEffect, useState } from "react";
// import Button from '@/components/login-btn'
import { StravaData, ApiResponse, Activity } from "@/types/types";
import { useSession, signIn, signOut } from "next-auth/react";
import dynamic from "next/dynamic";
const Button = dynamic(() => import("@/components/login-btn"), { ssr: false });
import Calendar from "@/components/Calendar";

const shades: Array<[number, string, number]> = [
  [0.25, "#FE8548", 1],
  [0.5, "#FE6A20", 2],
  [0.75, "#F25301", 3],
  [1.0, "#B73E01", 4],
];

interface DateDistanceBins {
  [key: string]: number;
}

// type Activity = {
//   date: string;
//   count: number;
//   value: number;
// };

export default function Home() {
  const { data: session } = useSession();
  const [dailyData, setDistances] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  function binData(data: StravaData[]): Activity[] {
    const bins = data.reduce((acc, d) => {
      if (d.distance === 0) return acc;

      const date = new Date(d.start_date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += d.distance;

      return acc;
    }, {} as DateDistanceBins);

    const dailyData: Activity[] = [];
    const maxDistance = Math.max(...Object.values(bins));
    Object.keys(bins).forEach((key) => {
      const distance = bins[key];
      const normalizedDistance = distance / maxDistance;
      for (const [threshold, color, level] of shades) {
        if (normalizedDistance <= threshold) {
          dailyData.push({ date: key, count: distance, value: level });
          break;
        }
      }
    });

    return dailyData.reverse();
  }

  useEffect(() => {
    if (session?.token?.access_token) {
      const before: number =
        new Date(new Date().getFullYear(), 0, 1).getTime() / 1000;
      const after: number =
        new Date(new Date().getFullYear() - 2, 11, 31).getTime() / 1000;
      const page: number = 1;
      const perPage: number = 200;

      fetch(
        `https://www.strava.com/api/v3/athlete/activities?before=${before}&after=${after}&page=${page}&per_page=${perPage}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.token.access_token}`,
          },
        },
      )
        .then((response) => response.json())
        .then((data: StravaData[]) => {
          const DateDistanceBins = binData(data);
          console.log(DateDistanceBins);
          setDistances(DateDistanceBins);
        })
        .catch((eror) => {
          console.error("Fetch error:", error);
          setError("Failed to load data");
        });
    }
  }, [session]);

  return (
    <div className="flex justify-center items-center h-screen">
      <Calendar data={dailyData} year={2023} />
    </div>
  );
}
