import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IntegerConstraint } from "src/app/models/IntegerConstraint";
import { FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-integer-constraint",
  templateUrl: "./integer-constraint.component.html",
  styleUrls: ["./integer-constraint.component.css"],
})
export class IntegerConstraintComponent {
  @Input() constraint!: IntegerConstraint;
  @Output() constraintChange: EventEmitter<IntegerConstraint>;
  @Output() errorState: EventEmitter<boolean>;

  weightErrorState: boolean;

  unitSelectorCtrl: FormControl;

  valueLabel: string;
  weightLabel: string;

  constructor() {
    this.constraintChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.valueLabel = "value";

    this.unitSelectorCtrl = new FormControl(null, Validators.required);

    this.weightErrorState = true;
    this.weightLabel = "weight";
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(
      this.weightErrorState || this.unitSelectorCtrl.hasError("required")
    );
  }

  updateWeightErrorState(e: boolean) {
    this.weightErrorState = e;
    this.emitConstraint();
  }
}
