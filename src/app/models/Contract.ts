import { Constraint } from "./Constraint";

export class Contract {
    name: string;
    // use of any type to be able to display the different templates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constraints: any[];

    constructor() {
        this.name = '';
        this.constraints = [];
    }

    toJson(profileName: string): ContractInterface {
        const cs = [];
        for(const constraint of this.constraints){
            cs.push((constraint as Constraint).toJson());
        }
        return {
            name: this.name,
            constraints: cs,
            profile: profileName,
        }
    }
}

export interface ContractInterface {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constraints:any[];
    profile: string;
}

export interface ContractGroupInterface {
    name: string;
    contracts:string[];
    profile: string;
}