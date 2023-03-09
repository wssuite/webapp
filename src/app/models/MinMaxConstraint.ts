import { BASE_VALUE, NON_ZERO_VALUE } from "../constants/constraints";
import { Constraint } from "./Constraint";

export class MinMaxConstraint extends Constraint {
  minValue: string;
  maxValue: string;
  minWeight: string;
  maxWeight: string;

  constructor(name: string, displayName: string) {
    super(name, displayName);
    this.minValue = BASE_VALUE;
    this.maxValue = BASE_VALUE;
    this.minWeight = NON_ZERO_VALUE;
    this.maxWeight = NON_ZERO_VALUE;
  }
}
