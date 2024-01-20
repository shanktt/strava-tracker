import React, { useEffect, useState } from "react";
import Button from "@/components/login-btn";
import { StravaData, Activity } from "@/types/types";
import { useSession, signIn, signOut } from "next-auth/react";
import Calendar from "@/components/Calendar";

const levels: Array<[number, number]> = [
  [0.25, 1],
  [0.5, 2],
  [0.75, 3],
  [1.0, 4],
];

interface DateDistanceBins {
  [key: string]: number;
}

export default function Home() {
  const { data: session } = useSession();
  const [dailyData, setDistances] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  function toFixedNumber(num: number, digits: number): number {
    const pow = Math.pow(10, digits);
    return Math.round(num * pow) / pow;
  }

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
      for (const [threshold, level] of levels) {
        if (normalizedDistance <= threshold) {
          dailyData.push({
            date: key,
            count: toFixedNumber(distance * 0.000621371, 2),
            value: level,
          });
          break;
        }
      }
    });

    return dailyData.reverse();
  }

  useEffect(() => {
    if (session?.token?.access_token) {
      console.log("wtf");
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
          setDistances(DateDistanceBins);
          setLoading(false);
        })
        .catch((eror) => {
          console.error("Fetch error:", error);
          setError("Failed to load data");
        });
    }
  }, [session]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="relative top-20 z-10">
        <Button />
      </div>
      <Calendar data={dailyData} year={2023} loading={loading} />
    </div>
  );
}
