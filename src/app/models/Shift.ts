export interface ShiftInterface {
    name: string;
    startTime: string;
    endTime: string;
  }

export interface ShiftTypeInterface{
  name:string;
  shifts: string[];
}

export interface ShiftGroupInterface{
  name:string;
  shifts: string[];
  shiftTypes: string[];
}