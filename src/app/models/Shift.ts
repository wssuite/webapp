export interface ShiftInterface {
    name: string;
    startTime: string
    endTime: string;
  }

export interface ShiftTypeInterface{
  name:string;
  shifts: ShiftInterface[]
}

export interface ShiftGroupInterface{
  name:string;
  shifts: ShiftInterface[]
  shiftsType: ShiftTypeInterface[]
}