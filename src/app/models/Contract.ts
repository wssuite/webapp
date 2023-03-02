import { Constraint } from "./Constraint";

export class Contract {
    name: string;
    // use of any type to be able to display the different templates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constraints: any[];
    skills: string[];

    constructor() {
        this.name = '';
        this.constraints = [];
        this.skills = [];
    }

    toJson(): ContractInterface {
        const cs = [];
        for(const constraint of this.constraints){
            cs.push((constraint as Constraint).toJson());
        }
        return {
            name: this.name,
            skills: this.skills,
            constraints: cs,
        }
    }
}

export interface ContractInterface {
    name: string;
    skills: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constraints:any[];
}