import { ContractInterface } from "./Contract";
import { ContractGroupInterface } from "./ContractGroup";
import { GenerationRequest } from "./GenerationRequest";
import { NurseGroupInterface, NurseInterface } from "./Nurse";
import { ShiftGroupInterface, ShiftInterface, ShiftTypeInterface } from "./Shift";
import { SkillInterface } from "./skill";

export interface BaseProfile {
    profile: string;
    creator: string;
}

export interface DetailedProfile{
    profile: string;
    contracts: ContractInterface[];
    contractGroups: ContractGroupInterface[],
    shifts: ShiftInterface[];
    shiftTypes: ShiftTypeInterface[];
    shiftGroups: ShiftGroupInterface[];
    nurses: NurseInterface[];
    nurseGroups: NurseGroupInterface[];
    skills: SkillInterface[];
}

export interface DetailedProblemProfile extends DetailedProfile {
    problem: GenerationRequest
}
