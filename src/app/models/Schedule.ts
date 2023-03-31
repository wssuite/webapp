import { EmployeeSchedule } from "./Assignment"
import { GenerationRequest } from "./GenerationRequest";

export interface Solution {
    startDate: string,
    endDate: string,
    profile: string,
    version: string,
    state: string,
    timestamp: string,
}

export interface DetailedSchedule {
    schedule: EmployeeSchedule;
    problem: GenerationRequest;
    previousVersions: Solution []; 
    startDate: string,
    endDate: string,
    profile: string,
    version: string,
    state: string, 
}