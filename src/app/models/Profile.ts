import { ContractInterface } from "./Contract";
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
    // to add contract groups
    shifts: ShiftInterface[];
    shiftTypes: ShiftTypeInterface[];
    shiftGroups: ShiftGroupInterface[];
    nurses: NurseInterface[];
    nurseGroups: NurseGroupInterface[];
    skills: SkillInterface[];
}