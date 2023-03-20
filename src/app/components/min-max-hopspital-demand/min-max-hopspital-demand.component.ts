import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BASE_VALUE } from 'src/app/constants/constraints';
import { SkillDemandInterface } from 'src/app/models/hospital-demand';



@Component({
  selector: 'app-min-max-hopspital-demand',
  templateUrl: './min-max-hopspital-demand.component.html',
  styleUrls: ['./min-max-hopspital-demand.component.css']
})
export class MinMaxHopspitalDemandComponent implements OnInit{
  @Output() demandChange: EventEmitter<SkillDemandInterface>;
  @Input() skill!: string;
  @Output() errorState: EventEmitter<boolean>;
  
  minValueErrorState: boolean;
  maxValueErrorState: boolean;
  maxWeightErrorState: boolean;
  minWeightErrorState: boolean;
  minWeightLabel: string;
  maxWeightLabel: string;
  skillDemand: SkillDemandInterface;
  
  constructor() {
    this.demandChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.minValueErrorState = true;
    this.maxValueErrorState = true;
    this.maxWeightErrorState = true;
    this.minWeightErrorState = true;
    this.maxWeightLabel = " Max weight";
    this.minWeightLabel = "Min weight"
    this.skillDemand = {
      skillId: this.skill,
      maxValue: "0",
      maxWeight: "0",
      minValue: "0",
      minWeight: "0"};
  }

  ngOnInit(): void {
      this.minValueErrorState = this.skillDemand.minValue === BASE_VALUE;
      this.maxValueErrorState = this.skillDemand.maxValue === BASE_VALUE;
      this.maxWeightErrorState = this.skillDemand.maxWeight === BASE_VALUE;
      this.minWeightErrorState = this.skillDemand.minWeight === BASE_VALUE;
      this.skillDemand.skillId = this.skill;
  }

  emitErrorState(){
    this.errorState.emit(this.minValueErrorState || this.maxValueErrorState ||
          this.minWeightErrorState || this.maxWeightErrorState) ;
  }

  emitSkillDemand() {
    this.demandChange.emit(this.skillDemand);
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
  }

  updateMaxWeightErrorState(e: boolean) {
    this.maxWeightErrorState = e;
    this.emitSkillDemand();
  }

  /*isSelected = (event: any) => {
    const date = event as moment.Moment
    
    return (this.dates.find(x => x.isSame(date))) ? "selected" : null;
  };
  
  select(event: any, calendar: any) {
    const date: moment.Moment = event

    const index = this.dates.findIndex(x => x.isSame(date));
    if (index < 0) this.dates.push(date);
    else this.dates.splice(index, 1);

    calendar.updateTodaysDate();
  }*/
}

