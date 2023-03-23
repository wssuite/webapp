import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BASE_VALUE } from "src/app/constants/constraints";
import { MinMaxConstraint } from "src/app/models/MinMaxConstraint";

@Component({
  selector: "app-min-max-constraint",
  templateUrl: "./min-max-constraint.component.html",
  styleUrls: ["./min-max-constraint.component.css"],
})
export class MinMaxConstraintComponent implements OnInit{
  @Input() constraint!: MinMaxConstraint;
  @Output() constraintChange: EventEmitter<MinMaxConstraint>;
  @Output() errorState: EventEmitter<boolean>;

  minValueErrorState: boolean;
  maxValueErrorState: boolean;
  minWeightErrorState: boolean;
  maxWeightErrorState: boolean;

  minWeightLabel: string;
  maxWeightLabel: string;

  constructor() {
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();

    this.minValueErrorState = true;
    this.maxValueErrorState = true;

    this.minWeightErrorState = true;
    this.maxWeightErrorState = true;

    this.minWeightLabel = "weight for min value";
    this.maxWeightLabel = "weight for max value";
  }

  ngOnInit(): void {
    this.minValueErrorState = this.constraint.minValue === '';
    this.maxValueErrorState = this.constraint.maxValue === '';
    this.maxWeightErrorState = this.constraint.maxWeight === BASE_VALUE;
    this.minWeightErrorState = this.constraint.minWeight === BASE_VALUE; 
    this.emitConstraint();   
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(
      this.minWeightErrorState ||
        this.maxWeightErrorState ||
        this.minValueErrorState ||
        this.maxValueErrorState
    );
  }

  updateMinWeightErrorState(e: boolean) {
    this.minWeightErrorState = e;
    this.emitConstraint();
  }
  updateMaxWeightErrorState(e: boolean) {
    this.maxWeightErrorState = e;
    this.emitConstraint();
  }

  updateMinValueErrorState(e: boolean) {
    this.minValueErrorState = e;
    this.emitConstraint();
  }

  updateMaxValueErrorState(e: boolean) {
    this.maxValueErrorState = e;
    this.emitConstraint();
  }
}
