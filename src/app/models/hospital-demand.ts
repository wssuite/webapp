export interface HospitalDemandInterface {
    date: string;
    shift: string;
    skill: string;
    minValue: string;
    maxValue: string;
    minWeight: string;
    maxWeight: string;
}

export interface SkillDemandInterface{
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

