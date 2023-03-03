import { BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class IntegerConstraint extends Constraint {
  value: string;
  weight: string;
  constructor(id: string, name: string) {
    super(id, name);
    this.value = BASE_VALUE;
    this.weight = BASE_VALUE;
  }
}
