import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BASE_VALUE } from 'src/app/constants/constraints';
import { SkillDemandInterface } from 'src/app/models/hospital-demand';



@Component({
  selector: 'app-min-max-hopspital-demand',
  templateUrl: './min-max-hopspital-demand.component.html',
  styleUrls: ['./min-max-hopspital-demand.component.css']
})
export class MinMaxHopspitalDemandComponent implements OnInit{
  @Input() demand!: SkillDemandInterface;
  @Output() demandChange: EventEmitter<SkillDemandInterface>;
  @Output() errorState: EventEmitter<boolean>;

  
  minValueErrorState: boolean;
  maxValueErrorState: boolean;
  maxWeightErrorState: boolean;
  minWeightErrorState: boolean;
  minWeightLabel: string;
  maxWeightLabel: string;
  minInputDisabled: boolean;
  maxInputDisabled: boolean;

  
  constructor() {
    this.demandChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.minValueErrorState = true;
    this.maxValueErrorState = true;
    this.maxWeightErrorState = true;
    this.minWeightErrorState = true;
    this.maxWeightLabel = " Max weight";
    this.minWeightLabel = "Min weight"
    this.minInputDisabled = false
    this.maxInputDisabled = false;
    this.demand = {
      maxValue: "0",
      maxWeight: "0",
      minValue: "0",
      minWeight: "0"};
  }

  ngOnInit(): void {
      this.minValueErrorState = this.demand.minValue === BASE_VALUE;
      this.maxValueErrorState = this.demand.maxValue === BASE_VALUE;
      this.maxWeightErrorState = this.demand.maxWeight === BASE_VALUE;
      this.minWeightErrorState = this.demand.minWeight === BASE_VALUE;
  }

  emitErrorState(){
    this.errorState.emit(this.minValueErrorState || this.maxValueErrorState ||
          this.minWeightErrorState || this.maxWeightErrorState) ;
  }

  emitSkillDemand() {
    this.demandChange.emit(this.demand);
    this.emitErrorState();
  }

  updateMinValueErrorState(e: boolean) {
    this.minValueErrorState = e;
    this.emitSkillDemand();
  }

  updateMaxValueErrorState(e: boolean) {
    this.maxValueErrorState = e;
    this.emitSkillDemand();
  }

  updateMinWeightErrorState(e: boolean) {
    this.minWeightErrorState = e;
    this.emitSkillDemand();
    this.minInputDisabled = this.demand.minWeight === "0"
  }

  updateMaxWeightErrorState(e: boolean) {
    this.maxWeightErrorState = e;
    this.emitSkillDemand();
    this.maxInputDisabled = this.demand.maxWeight === "0"
  }

}

