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

export interface NurseHistoryElement {
    date: string;
    username: string;
    shift: string;
}

export interface GenerationRequest {
    startDate: string;
    endDate: string;
    profile: string;
    hospitalDemand: HospitalDemandElement[];
    preferences: SchedulePreferenceElement[];
    history: NurseHistoryElement[];
    nurses: string[];
    skills: string[];
    shifts: string[];
}
