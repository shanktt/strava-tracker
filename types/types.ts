export interface StravaData {
  distance: number;
  start_date: string;
}

export type ApiResponse = StravaData[] | { error: string };

export type Activity = {
  date: string;
  count: number;
  value: number;
  isPadded?: boolean;
};
