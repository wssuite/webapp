import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BASE_VALUE } from 'src/app/constants/constraints';
import { HospitalDemandInterface } from 'src/app/models/hospital-demand';
import { MinMaxShiftConstraint } from 'src/app/models/MinMaxShiftConstraint';

@Component({
  selector: 'app-min-max-hopspital-demand',
  templateUrl: './min-max-hopspital-demand.component.html',
  styleUrls: ['./min-max-hopspital-demand.component.css']
})
export class MinMaxHopspitalDemandComponent implements OnInit{
  @Input() hospitalDemand!: HospitalDemandInterface;
  @Output() demandChange: EventEmitter<HospitalDemandInterface>;
  @Input() possibleShifts!: string[];
  @Input() possibleSkills!: string[];
  @Output() errorState: EventEmitter<boolean>;
  
  minValueErrorState: boolean;
  maxValueErrorState: boolean;
  maxWeightErrorState: boolean;
  minWeightErrorState: boolean;
  selectShiftFormCtrl: FormControl;
  selectSkillFormCtrl: FormControl;
  minWeightLabel: string;
  maxWeightLabel: string;

  constructor() {
    this.demandChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.minValueErrorState = true;
    this.maxValueErrorState = true;
    this.maxWeightErrorState = true;
    this.minWeightErrorState = true;
    this.selectShiftFormCtrl = new FormControl(null, Validators.required);
    this.selectSkillFormCtrl = new FormControl(null, Validators.required);
    this.maxWeightLabel = " Max weight";
    this.minWeightLabel = "Min weight"
  }

  ngOnInit(): void {
      this.selectShiftFormCtrl.setValue(this.hospitalDemand.shiftId);
      this.selectSkillFormCtrl.setValue(this.hospitalDemand.shiftId);
      this.minValueErrorState = this.hospitalDemand.minValue === "";
      this.maxValueErrorState = this.hospitalDemand.maxValue === "";
      this.maxWeightErrorState = this.hospitalDemand.maxWeight === BASE_VALUE;
      this.minWeightErrorState = this.hospitalDemand.minWeight === BASE_VALUE;
  }

  emitErrorState(){
    this.errorState.emit(this.minValueErrorState || this.maxValueErrorState ||
          this.minWeightErrorState || this.maxWeightErrorState ||
          this.selectSkillFormCtrl.hasError('required') ||  this.selectShiftFormCtrl.hasError('required')) ;
  }

  emitDemand() {
    this.demandChange.emit(this.hospitalDemand);
    this.emitErrorState();
  }

  updateMinValueErrorState(e: boolean) {
    this.minValueErrorState = e;
    this.emitDemand();
  }

  updateMaxValueErrorState(e: boolean) {
    this.maxValueErrorState = e;
    this.emitDemand(); 
  }

  updateMinWeightErrorState(e: boolean) {
    this.minWeightErrorState = e;
    this.emitDemand();
  }

  updateMaxWeightErrorState(e: boolean) {
    this.maxWeightErrorState = e;
    this.emitDemand();
  }
}

