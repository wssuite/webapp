export interface Shift {
    name: string;
    startTime: string
    endTime: string;
  }

export interface ShiftType{
  name:string;
  shift: Shift[]
}

export interface ShiftGroup{
  name:string;
  shift: Shift[]
  shiftType: ShiftType[]
}