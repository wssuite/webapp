import { Contract } from "./Contract";
import { NurseGroupInterface, NurseInterface } from "./Nurse";
import { ShiftGroupInterface, ShiftInterface, ShiftTypeInterface } from "./Shift";
import { SkillInterface } from "./skill";

export interface BaseProfile {
    profile: string;
    creator: string;
}

export interface DetailedProfile{
    profile: string;
    contracts: Contract[];
    // to add contract groups
    shifts: ShiftInterface[];
    shiftTypes: ShiftTypeInterface[];
    shiftGroups: ShiftGroupInterface[];
    nurse: NurseInterface[];
    nurseGroups: NurseGroupInterface[];
    skills: SkillInterface[];
}