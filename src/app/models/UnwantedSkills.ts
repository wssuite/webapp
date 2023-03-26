import { BASE_VALUE } from "../constants/constraints";
import { Exception } from "../utils/Exception";
import { Constraint} from "./Constraint";

export class UnwantedSkills extends Constraint{
    skills: string[]
    weight: string;
    
    constructor(id: string, name: string, description?: string){
        super(id, name, description);
        this.skills = [""];
        this.weight = BASE_VALUE;
    }
    
    validateConstraint(c: Constraint): void {
        const constraint = c as UnwantedSkills;
        if(!constraint){
            return;
        }
        
        if(this.displayName !== constraint.displayName) {
            return;
        }
        constraint.skills.forEach((s:string)=>{
            if(this.skills.includes(s)){
                throw new Exception(this.getRepetitiveErrorMessage())
            }
        })
    }
    
    toJson(): unwantedSkillsInterface {
        return {
            name: this.name,
            skills: this.skills,
            weight: this.weight,
        }
    }
    
    clone(): UnwantedSkills {
        const ret = new UnwantedSkills(this.name, this.displayName);
        ret.skills = [];
        this.skills.forEach((skill)=>{
            ret.skills.push(skill);
        })
        ret.weight = this.weight;
        return ret;
    }

    equals(c: UnwantedSkills): boolean {
        let sameSkills = false;
        c.skills.forEach((s)=>{
            this.skills.forEach((skill)=>{
                if(skill === s){
                    sameSkills = true;
                }
            })
        })
        return sameSkills && this.weight === c.weight;
    }

    fromJson(c: unwantedSkillsInterface): void {
        this.skills = c.skills;
        this.weight = c.weight;
    }
}

export interface unwantedSkillsInterface {
    name: string;
    skills: string[];
    weight: string;
}