import { ShiftInterface, ShiftGroupInterface, ShiftTypeInterface } from "../models/Shift";

export const shiftsExample: ShiftInterface[] = [
    {
      name: "Early",
      startTime: "6h00 AM",
      endTime: "11h00 AM"
    },
    {
      name: "MidDay",
      startTime: "11h00 AM",
      endTime: "15Hh00 PM"
    },
    {
       name: "Late",
       startTime: "15h00 PM",
       endTime: "20h00 PM"
    }
  ];

export const shiftsTypeExample: ShiftTypeInterface[] = [
    {
        name:"Rotating shift",
        shifts: [    {
            name: "Early",
            startTime: "6h00 AM",
            endTime: "11h00 AM"
          },     
          {
            name: "Late",
            startTime: "15h00 PM",
            endTime: "20h00 PM"
          }]},
    {
        name:"Night shift",
        shifts:  [
          {
            name: "Early",
            startTime: "6h00 AM",
            endTime: "11h00 AM"
          }
        ]
    },
    {
        name:"Permanent shift",
        shifts:  []
    },
    {
        name:"Fixed shift",
        shifts:  []
    },
    {
        name:"On-Call Shift",
        shifts:  []
    }
]

export const shiftGroupExample: ShiftGroupInterface[] = [    
    {
    name:"Work",
    shifts: [    {
        name: "Early",
        startTime: "6h00 AM",
        endTime: "11h00 AM"
      },
      {
        name: "MidDay",
        startTime: "11h00 AM",
        endTime: "15Hh00 PM"
      },
      {
         name: "Late",
         startTime: "15h00 PM",
         endTime: "20h00 PM"
      }],
    shiftsType: [    {
        name:"Night shift",
        shifts:  [          {
            name: "Early",
            startTime: "6h00 AM",
            endTime: "11h00 AM"
          }]
    }]},
{
    name:"Rest",
    shifts:  [],
    shiftsType: []
}];



