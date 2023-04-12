import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { NUMERIC_POSITIVE_NUMBERS } from "src/app/constants/regex";

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
export class NumericInputComponent implements OnInit, OnChanges{
  @Input() value!: string;
  @Output() valueChange: EventEmitter<string>;

  inputCtrl: FormControl;
  @Input() disabled: boolean;

  matcher: CustomErrorStateMatcher;
  @Output() errorState: EventEmitter<boolean>;

  constructor() {
    this.valueChange = new EventEmitter<string>();
    this.disabled = false;
    this.inputCtrl = new FormControl({ value: this.value, disabled: false }, [
      Validators.required,
      Validators.pattern(NUMERIC_POSITIVE_NUMBERS),
      Validators.min(0),
    ]);
    this.matcher = new CustomErrorStateMatcher();
    this.errorState = new EventEmitter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const disabledChange = changes["disabled"]
    if(disabledChange){
      this.disabled = disabledChange.currentValue
    }
    this.inputCtrl = this.createFormControl()
  }

  ngOnInit(): void {
    this.inputCtrl = this.createFormControl()
    this.inputCtrl.setValue(this.value);
      this.emitValue();
  }

  createFormControl():FormControl{
    return new FormControl({ value: this.value, disabled: this.disabled }, [
      Validators.required,
      Validators.pattern(NUMERIC_POSITIVE_NUMBERS),
      Validators.min(0),
    ]);
  }

  emitValue() {
    this.valueChange.emit(this.value);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(
      this.inputCtrl.hasError("required") ||
        this.inputCtrl.hasError("pattern") ||
        this.inputCtrl.hasError("min")
    );
  }
}