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

    fromJson(p: PatternElementInterface):void {
        this.dayName = p.dayName;
        this.shiftId = p.shiftId;
    }
}

export interface PatternElementInterface{
    shiftId: string;
    dayName: string;
}