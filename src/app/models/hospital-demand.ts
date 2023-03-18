export interface HospitalDemandInterface {
    date: string;
    shiftId: string;
    skillId: string;
    maxValue: string;
    maxWeight: string;
    minValue: string;
    minWeight: string;
}

export interface ScheduleDataInterface{
    startDate: Date;
    endDate: Date;
    shifts:string[];
    skills:string[];
}