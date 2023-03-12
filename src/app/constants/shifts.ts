import { ShiftInterface, ShiftGroupInterface, ShiftTypeInterface } from "../models/Shift";

export const shiftsExample: ShiftInterface[] = [
    {
      name: "Early",
      startTime: "6h00 AM",
      endTime: "11h00 AM",
      profile:"",
    },
    {
      name: "MidDay",
      startTime: "11h00 AM",
      endTime: "15Hh00 PM",
      profile:"",
    },
    {
       name: "Late",
       startTime: "15h00 PM",
       endTime: "20h00 PM",
       profile:"",
    }
  ];

export const shiftsTypeExample: ShiftTypeInterface[] = [
    {
        name:"Rotating shift",
        shifts: [ "Early","Late","Night shift","Early"],
        profile:"",
    },
    {
        name:"Permanent shift",
        shifts:  [],
        profile:"",
    },
    {
        name:"Fixed shift",
        shifts:  [],
        profile:"",
    },
    {
        name:"On-Call Shift",
        shifts:  [],
        profile:"",
    }
]

export const shiftGroupExample: ShiftGroupInterface[] = [    
    {
    name:"Work",
    shifts:[ "Early","Late","Permanent shift","Early"],
    profile:"",
}];

export const shiftExample: string[] = [ "Early","Late","Permanent shift","Early"]



