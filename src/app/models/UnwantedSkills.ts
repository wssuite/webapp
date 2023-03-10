import { BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class UnwantedSkills extends Constraint{
    skills: string[]
    weight: string;

    constructor(id: string, name: string){
        super(id, name);
        this.skills = [""];
        this.weight = BASE_VALUE;
    }
}