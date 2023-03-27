export interface HospitalDemandInterface {
    date: string;
    shift: string;
    skill: string;
    max_value: string;
    max_weight: string;
    min_value: string;
    min_weight: string;
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

