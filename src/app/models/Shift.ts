export interface ShiftInterface {
    name: string;
    startTime: string
    endTime: string;
    profile:string;
  }

export interface ShiftTypeInterface{
  name:string;
  shifts: string[];
  profile:string;
}

export interface ShiftGroupInterface{
  name:string;
  shifts: string[];
  profile: string;
}