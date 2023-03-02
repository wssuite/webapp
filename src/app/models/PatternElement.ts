import { Exception } from "../utils/Exception";

export class PatternElement {
    dayName: string;
    shiftId: string;

    constructor(){
        this.dayName = '';
        this.shiftId = '';
    }

    validatePattern(p: PatternElement): void{
        if(p.dayName === this.dayName && p.shiftId === this.shiftId){
            throw new Exception("Repetitive day shift pattern");
        }
    }

    toJson(): PatternElementInterface{
        return {
            shiftId: this.shiftId,
            dayName: this.dayName,
        }
    }
}

export interface PatternElementInterface{
    shiftId: string;
    dayName: string;
}