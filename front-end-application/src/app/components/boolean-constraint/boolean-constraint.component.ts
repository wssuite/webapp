import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BASE_VALUE, WEIGHT_LABEL } from "src/app/constants/constraints";
import { BOOLEAN_CONSTRAINT_DISCLAIMER } from "src/app/constants/constraintsDescriptions";
import { BooleanConstraint } from "src/app/models/BooleanConstraint";

@Component({
  selector: "app-boolean-constraint",
  templateUrl: "./boolean-constraint.component.html",
  styleUrls: ["./boolean-constraint.component.css"],
})
export class BooleanConstraintComponent implements OnInit{
  @Input() constraint!: BooleanConstraint;
  @Output() constraintChange: EventEmitter<BooleanConstraint>;
  @Output() errorState: EventEmitter<boolean>;

  weightErrorState: boolean;
  weightLabel: string;
  disclaimer: string;

  constructor() {
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();

    this.weightErrorState = true;
    this.weightLabel = WEIGHT_LABEL;
    this.disclaimer = BOOLEAN_CONSTRAINT_DISCLAIMER;
  }

  ngOnInit(): void {
    this.weightErrorState = this.constraint.weight === BASE_VALUE;
    this.emitConstraint(); 
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.weightErrorState);
  }

  updateWeightErrorState(e: boolean) {
    this.weightErrorState = e;
    this.emitConstraint();
  }
}
