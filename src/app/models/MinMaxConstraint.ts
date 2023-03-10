import { BASE_VALUE, WEIGHT_INITIAL_VALUE } from "../constants/constraints";
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
    this.minWeight = WEIGHT_INITIAL_VALUE;
    this.maxWeight = WEIGHT_INITIAL_VALUE;
  }
}
