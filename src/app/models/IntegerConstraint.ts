import { BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class IntegerConstraint extends Constraint {
  value: string;
  units: string[];
  chosenUnit: string;
  weight: string;
  constructor(id: string, name: string) {
    super(id, name);
    this.value = BASE_VALUE;
    this.units = ["hours", "shifts"];
    this.chosenUnit = this.units[0];
    this.weight = BASE_VALUE;
  }
}
