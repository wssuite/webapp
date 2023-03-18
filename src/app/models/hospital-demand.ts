export interface HospitalDemandInterface {
    date: string;
    shift: string;
    skill: string;
    max: number;
    max_weight: number;
    min: number;
    min_weight: number;
}

export interface ScheduleDataInterface{
    startDate: Date;
    endDate: Date;
    shifts:string[];
    skills:string[];
}