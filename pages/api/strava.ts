// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { StravaData, ApiResponse } from "@/types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  const session = await getServerSession(req, res, authOptions);
  if (session) {
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
        // Extract only the distance and start date from each activity
        const distances = data.map((activity) => ({
          distance: activity.distance,
          start_date: activity.start_date,
        }));
        return res.status(200).json(distances);
      })
      .catch((error) => {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    return res.status(401).json({ error: "not logged in" });
  }
}
