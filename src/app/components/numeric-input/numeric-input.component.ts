import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

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
  selector: "app-numeric-input",
  templateUrl: "./numeric-input.component.html",
  styleUrls: ["./numeric-input.component.css"],
})
export class NumericInputComponent {
  @Input() value!: string;

  localValue: string;
  @Output() valueChange: EventEmitter<string>;
  numberChecks: number;
  disabled: boolean;
  inputCtrl: FormControl;

  matcher: CustomErrorStateMatcher;
  @Output() errorState: EventEmitter<boolean>;

  constructor() {
    this.valueChange = new EventEmitter<string>();
    this.numberChecks = 0;
    this.disabled = false;
    this.localValue = "0";
    this.inputCtrl = new FormControl({ value: this.value, disabled: false }, [
      Validators.required,
      Validators.pattern("([0-9]+)(.([0-9]+))*"),
      Validators.min(0),
    ]);
    this.matcher = new CustomErrorStateMatcher();
    this.errorState = new EventEmitter();
  }

  emitValue() {
    this.valueChange.emit(this.value);
    this.emitErrorState();
  }

  updateFormControl(disabled: boolean): FormControl {
    if (disabled) {
      return new FormControl({ value: this.localValue, disabled: true });
    }
    return new FormControl({ value: this.value, disabled: false }, [
      Validators.required,
      Validators.pattern("([0-9]+)(.([0-9]+))*"),
      Validators.min(0),
    ]);
  }

  updateValues() {
    this.localValue = this.value;
  }

  emitErrorState() {
    this.errorState.emit(
      this.inputCtrl.hasError("required") ||
        this.inputCtrl.hasError("pattern") ||
        this.inputCtrl.hasError("min")
    );
  }
}
