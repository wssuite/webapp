import { BASE_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class BooleanConstraint extends Constraint {
  weight: string;
  constructor(id: string, name: string) {
    super(id, name);
    this.weight = BASE_VALUE;
  }
}
