export interface Workout {
    type: string;
    minutes: number;
    date: Date;
  }
  
  export interface User {
    id: number;
    name: string;
    workouts: Workout[];
  }
  