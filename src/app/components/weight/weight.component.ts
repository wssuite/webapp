import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { POSITIVE_NUMBERS } from "src/app/constants/regex";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: "app-weight",
  templateUrl: "./weight.component.html",
  styleUrls: ["./weight.component.css"],
})
export class WeightComponent {
  @Input() weight!: string;

  localWeight: string;

  @Output() weightChange: EventEmitter<string>;
  numberChecks: number;
  disabled: boolean;
  inputCtrl: FormControl;

  matcher: CustomErrorStateMatcher;
  @Output() errorState: EventEmitter<boolean>;

  constructor() {
    this.weightChange = new EventEmitter<string>();
    this.numberChecks = 0;
    this.disabled = false;
    this.localWeight = "0";
    this.inputCtrl = new FormControl({ value: this.weight, disabled: false }, [
      Validators.required,
      Validators.pattern(POSITIVE_NUMBERS),
      Validators.min(0),
    ]);
    this.matcher = new CustomErrorStateMatcher();
    this.errorState = new EventEmitter();
  }

  update() {
    console.log("here");
    this.numberChecks++;
    if (this.numberChecks % 2 === 0) {
      this.disabled = false;
      this.weight = this.localWeight;
    } else {
      this.localWeight = this.weight;
      this.disabled = true;
      this.weight = "hard";
    }
    this.inputCtrl = this.updateFormControl(this.disabled);
  }

  emitWeight() {
    this.weightChange.emit(this.weight);
    this.emitErrorState();
  }

  updateFormControl(disabled: boolean): FormControl {
    if (disabled) {
      return new FormControl({ value: this.localWeight, disabled: true });
    }
    return new FormControl({ value: this.weight, disabled: false }, [
      Validators.required,
      Validators.pattern(POSITIVE_NUMBERS),
      Validators.min(0),
    ]);
  }

  updateValues() {
    this.localWeight = this.weight;
  }

  emitErrorState() {
    this.errorState.emit(
      this.inputCtrl.hasError("required") ||
        this.inputCtrl.hasError("pattern") ||
        this.inputCtrl.hasError("min")
    );
  }
}
