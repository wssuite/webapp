import { Shift, ShiftGroup, ShiftType } from "../models/Shift";

export const shiftsExample: Shift[] = [
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

export const shiftsTypeExample: ShiftType[] = [
    {
        name:"Rotating shift",
        shift: [    {
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
        shift:  [
          {
            name: "Early",
            startTime: "6h00 AM",
            endTime: "11h00 AM"
          }
        ]
    },
    {
        name:"Permanent shift",
        shift:  []
    },
    {
        name:"Fixed shift",
        shift:  []
    },
    {
        name:"On-Call Shift",
        shift:  []
    }
]

export const shiftGroupExample: ShiftGroup[] = [    
    {
    name:"Work",
    shift: [    {
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
    shiftType: [    {
        name:"Night shift",
        shift:  [          {
            name: "Early",
            startTime: "6h00 AM",
            endTime: "11h00 AM"
          }]
    }]},
{
    name:"Rest",
    shift:  [],
    shiftType: []
}];



