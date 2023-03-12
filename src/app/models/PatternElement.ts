import { Exception } from "../utils/Exception";

export class PatternElement {
    days: string[];
    shifts: string[];

    constructor(){
        this.days = [];
        this.shifts = [];
    }

    validatePattern(p: PatternElement): void{
        let sameDays= true;
        let sameShifts =true;
        p.days.forEach((day: string)=>{
            if(!this.days.includes(day)){
                sameDays = false;
            }
        })
        p.shifts.forEach((shift: string)=>{
            if(!this.shifts.includes(shift)){
                sameShifts = false;
            }
        })
        if(sameDays && sameShifts){
            throw new Exception("Repetitive day shift pattern");
        }
    }

    toJson(): PatternElementInterface{
        return {
            shifts: this.shifts,
            days: this.days,
        }
    }
}

export interface PatternElementInterface{
    shifts: string[];
    days: string[];
}