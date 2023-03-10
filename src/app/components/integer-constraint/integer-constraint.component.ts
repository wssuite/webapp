import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BASE_VALUE } from "src/app/constants/constraints";
import { IntegerConstraint } from "src/app/models/IntegerConstraint";

@Component({
  selector: "app-integer-constraint",
  templateUrl: "./integer-constraint.component.html",
  styleUrls: ["./integer-constraint.component.css"],
})
export class IntegerConstraintComponent implements OnInit{
  @Input() constraint!: IntegerConstraint;
  @Output() constraintChange: EventEmitter<IntegerConstraint>;
  @Output() errorState: EventEmitter<boolean>;

  weightErrorState: boolean;
  valueErrorState: boolean;

  valueLabel: string;
  weightLabel: string;

  constructor() {
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();

    this.valueErrorState = true;
    this.valueLabel = "value";

    this.weightErrorState = true;
    this.weightLabel = "weight";
  }

  ngOnInit(): void {
    this.weightErrorState = this.constraint.weight === BASE_VALUE;
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.weightErrorState || this.valueErrorState);
  }

  updateWeightErrorState(e: boolean) {
    this.weightErrorState = e;
    this.emitConstraint();
  }

  updateValueErrorState(e: boolean) {
    this.valueErrorState = e;
    this.emitConstraint();
  }
}
