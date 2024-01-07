export interface StravaData {
    distance: number;
    start_date: string
  }
  
  export type ApiResponse = StravaData[] | { error: string };
  