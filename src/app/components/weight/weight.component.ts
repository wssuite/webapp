import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  constructor(private control: FormControl){}
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(this.control && this.control.invalid && (this.control.dirty || this.control.touched || isSubmitted));
  }
  hasError(){
    this.control.getError("required")|| this.control.getError("min") || this.control.get("pattern")
  }
}

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css']
})

export class WeightComponent {

  @Input() weight!: string|number;

  localWeight: number;

  @Output() weightChange: EventEmitter<string|number>;
  numberChecks: number;
  disabled: boolean
  inputCtrl: FormControl;

  matcher: CustomErrorStateMatcher;

  constructor() {
    this.weightChange = new EventEmitter<string|number>();
    this.numberChecks = 0;
    this.disabled = false;
    this.localWeight = 0;
    this.inputCtrl = new FormControl(this.weight, [
      Validators.required,
      Validators.pattern("([0-9]+)(.([0-9]+))*"),
      Validators.min(0),
    ])
    this.matcher = new CustomErrorStateMatcher(this.inputCtrl)
  }

  update() {
    console.log("here")
    this.numberChecks++;
    if(this.numberChecks %2 === 0) {
      this.disabled = false;
      this.weight = this.localWeight;
    }
    else {
      //this.localWeight = this.weight;
      this.disabled = true;
      this.weight = "hard";
    }
  }

  emitWeight() {
    this.weightChange.emit(this.weight);
  }

}
