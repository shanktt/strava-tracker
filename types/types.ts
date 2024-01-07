export interface Activity {
    distance: number;
    start_date: string
  }
  
  export type ApiResponse = Activity[] | { error: string };
  