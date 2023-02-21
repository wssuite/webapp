import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-weight',
  templateUrl: './weight.component.html',
  styleUrls: ['./weight.component.css']
})

export class WeightComponent {

  @Input() weight!: string;

  localWeight: string;

  @Output() weightChange: EventEmitter<string>;
  numberChecks: number;
  disabled: boolean
  inputCtrl: FormControl;

  matcher: CustomErrorStateMatcher;

  constructor() {
    this.weightChange = new EventEmitter<string>();
    this.numberChecks = 0;
    this.disabled = false;
    this.localWeight = "0";
    this.inputCtrl = new FormControl({value:this.weight, disabled:false},[
      Validators.required,
      Validators.pattern("([0-9]+)(.([0-9]+))*"),
      Validators.min(0),
    ])
    this.matcher = new CustomErrorStateMatcher()
  }

  update() {
    console.log("here")
    this.numberChecks++;
    if(this.numberChecks %2 === 0) {
      this.disabled = false;
      this.weight = this.localWeight;
    }
    else {
      this.localWeight = this.weight
      this.disabled = true;
      this.weight = "hard";
    }
    this.inputCtrl = this.updateFormControl(this.disabled);
  }

  emitWeight() {
    this.weightChange.emit(this.weight);
  }

  updateFormControl(disabled: boolean):FormControl {
    if(disabled){
      return new FormControl({value:this.localWeight, disabled:true})  
    }
    return new FormControl({value:this.weight, disabled:false},[
      Validators.required,
      Validators.pattern("([0-9]+)(.([0-9]+))*"),
      Validators.min(0),
    ])
  }

  updateValues(){
    this.localWeight = this.weight
  }

}
