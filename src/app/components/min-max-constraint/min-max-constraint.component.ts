import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
  constraintCopy!: MinMaxConstraint;

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
    this.constraintCopy = this.constraint.clone();    
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
        this.maxValueErrorState ||
        this.constraint.equals(this.constraintCopy)
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
