import { BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class IntegerConstraint extends Constraint {
  value: string;
  weight: string;
  units: string[];
  chosenUnit: string;

  constructor(name: string, displayName: string) {
    super(name, displayName);
    this.value = BASE_VALUE;
    this.weight = BASE_VALUE;
    this.units = ["hours", "shifts"];
    this.chosenUnit = this.units[0];
  }
}