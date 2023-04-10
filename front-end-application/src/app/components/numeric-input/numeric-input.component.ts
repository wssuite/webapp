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
  @Input()  isDisabled: boolean;
  @Output() isDisabledChange: EventEmitter<boolean>;

  inputCtrl: FormControl;

  matcher: CustomErrorStateMatcher;
  @Output() errorState: EventEmitter<boolean>;

  constructor() {
    this.valueChange = new EventEmitter<string>();
    this.isDisabledChange = new EventEmitter<boolean>();
    this.isDisabled = false;
    this.inputCtrl = new FormControl({ value: this.value, disabled: false}, [
      Validators.required,
      Validators.pattern(NUMERIC_POSITIVE_NUMBERS),
      Validators.min(0),
    ]);
    this.matcher = new CustomErrorStateMatcher();
    this.errorState = new EventEmitter();
  }

  ngOnInit(): void {
      this.inputCtrl.setValue(this.value);
      this.inputCtrl = this.updateFormControl(this.isDisabled);
      this.emitValue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isDisabled"] && changes["isDisabled"].currentValue) {
      this.isDisabled = changes["isDisabled"].currentValue;   
  }
  this.inputCtrl = this.updateFormControl(this.isDisabled);
}


  emitValue() {
    this.valueChange.emit(this.value);
    this.emitErrorState();
  }

  
  updateFormControl(disabled: boolean): FormControl {
    if(disabled){
      return new FormControl({ value: this.value, disabled: true}, [
          Validators.required,
          Validators.pattern(NUMERIC_POSITIVE_NUMBERS),
          Validators.min(0),
        ]);
    }
    return this.inputCtrl = new FormControl({ value: this.value, disabled: false}, [
      Validators.required,
      Validators.pattern(NUMERIC_POSITIVE_NUMBERS),
      Validators.min(0),
    ]);
  }

  emitErrorState() {
    this.errorState.emit(
      this.inputCtrl.hasError("required") ||
        this.inputCtrl.hasError("pattern") ||
        this.inputCtrl.hasError("min")
    );
  }
}
