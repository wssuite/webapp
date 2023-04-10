import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import {
  WEIGHT_MAX_VALUE,
  WEIGHT_MIN_VALUE,
} from "src/app/constants/constraints";
import { WEIGHT_ALLOWED_INTEGERS } from "src/app/constants/regex";

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
export class WeightComponent implements OnInit, OnChanges{
  @Input() weight!: string;
  @Input() label!: string;
  @Input()  isDisabled: boolean;
  @Output() isDisabledChange: EventEmitter<boolean>;

  localWeight: string;

  @Output() weightChange: EventEmitter<string>;
  numberChecks: number;
  disabled: boolean;
  inputCtrl: FormControl;

  matcher: CustomErrorStateMatcher;
  @Output() errorState: EventEmitter<boolean>;

  constructor() {
    this.weightChange = new EventEmitter<string>();
    this.isDisabledChange = new EventEmitter<boolean>();
    this.isDisabled =false;
    this.numberChecks = 0;
    this.disabled = false;
    this.localWeight = "";
    this.inputCtrl = new FormControl({ value: this.weight, disabled: false}, [
      Validators.required,
      Validators.pattern(WEIGHT_ALLOWED_INTEGERS),
      Validators.min(WEIGHT_MIN_VALUE),
      Validators.max(WEIGHT_MAX_VALUE),
    ]);
    this.matcher = new CustomErrorStateMatcher();
    this.errorState = new EventEmitter();
  }

  ngOnInit(): void {
    this.disabled = this.weight === "hard"? true: false;
    this.update();
    if(!this.disabled){
      this.inputCtrl.setValue(this.weight)
    }
    this.emitWeight();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isDisabled"] && changes["isDisabled"].currentValue) {
      this.isDisabled = changes["isDisabled"].currentValue;   
  }
  if (this.isDisabled) {
    this.inputCtrl = new FormControl({ value: this.localWeight, disabled: true });
  }
  else{
    this.inputCtrl = new FormControl({ value: this.localWeight, disabled: false });
  }
}


  update() {
    this.numberChecks++;
    if (!this.disabled) {
      this.weight = this.localWeight === ""? this.weight: this.localWeight;
      if(this.weight === "hard"){
        this.weight = "0";
      }
    } 
    else {
        if(this.weight !== "hard"){
          this.localWeight = this.weight;
        }
        this.weight = "hard";
    }
    this.inputCtrl = this.updateFormControl(this.disabled);
    this.emitWeight();
  }

  emitWeight() {
    this.weightChange.emit(this.weight);
    this.emitErrorState();
  }

  updateFormControl(disabled: boolean): FormControl {
    if (disabled || this.isDisabled) {
      return new FormControl({ value: this.localWeight, disabled: true });
    }
    return new FormControl({ value: this.weight, disabled: false }, [
      Validators.required,
      Validators.pattern(WEIGHT_ALLOWED_INTEGERS),
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
