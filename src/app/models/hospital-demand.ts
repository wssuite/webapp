export interface HospitalDemandInterface {
    date: string[];
    shifts: string[];
    skills: string[];
}

export interface SkillDemandInterface{
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


export class HospitalDemand {
    skills: string[];
    shifts: string[];
    date: string[];

    constructor(){
        this.skills = [];
        this.shifts = [];
        this.date = [];
    }


    toJson(): HospitalDemandInterface{
        return {
            shifts: this.shifts,
            skills: this.skills,
            date: this.date,
        }
    }

    fromJson(p: HospitalDemandInterface):void {
        this.skills = p.skills;
        this.shifts = p.shifts;
        this.date = p.date;

    }

    clone(): HospitalDemand{
        const ret = new HospitalDemand();
        ret.skills = this.skills;
        ret.shifts = this.shifts;
        ret.date = this.date;
        return ret;
    }

    equals(p: HospitalDemand): boolean {
        return this.skills === p.skills && this.shifts === p.shifts;
    }
}

