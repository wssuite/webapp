export interface Shift {
    name: string;
    startTime: string
    endTime: string;
  }

export interface ShiftType{
  name:string;
  shifts: Shift[]
}

export interface ShiftGroup{
  name:string;
  shifts: Shift[]
  shiftsType: ShiftType[]
}