export interface SchedulePreferenceElement {
    date: string;
    username: string;
    preference: string;
    shift: string;
    weight: string;
}

export interface HospitalDemandElement {
    date: string;
    shift: string;
    skill: string;
    minValue: string;
    maxValue: string;
    minWeight: string;
    maxWeight: string;
}

export interface GenerationRequest {
    startDate: string;
    endDate: string;
    profile: string;
    hospitalDemand: HospitalDemandElement[];
    preferences: SchedulePreferenceElement[];
    nurses: string[];
    skills: string[];
    shifts: string[];
}
