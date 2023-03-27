import { Component,EventEmitter,Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { WEIGHT_ALLOWED_INTEGERS } from 'src/app/constants/regex';
import { dateDisplay } from 'src/app/models/DateDisplay';
import { HospitalDemandInterface, SkillDemandInterface } from 'src/app/models/hospital-demand';
import { DateUtils } from 'src/app/utils/DateUtils';


@Component({
  selector: 'app-hopspital-demand-creation',
  templateUrl: './hopspital-demand-creation.component.html',
  styleUrls: ['./hopspital-demand-creation.component.css']
})
export class HopspitalDemandCreationComponent  implements OnInit, OnChanges{
  regex = WEIGHT_ALLOWED_INTEGERS

  @Input() shifts!: string[];
  @Input() skills!: string[]; 
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Output() hospitalDemand: EventEmitter<HospitalDemandInterface[]>
  
  skillDemand: SkillDemandInterface;
  buttonMaxLabel: string;
  buttonMinLabel: string;
  skillDemandErrorState: boolean;
  timetable: dateDisplay[];
  hospitalDemands: Map<dateDisplay, Map<string,Map<string, {demand: SkillDemandInterface}>>>;
  nbColumns: number | undefined;
  

  constructor() {
    this.hospitalDemand = new EventEmitter<HospitalDemandInterface[]>();
    this.timetable = [];
    this.hospitalDemands = new Map();
    this.skillDemand = {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};
    this.skillDemandErrorState = true;
    this.buttonMaxLabel = "Max: 0";
    this.buttonMinLabel = "Min: 0";

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["skills"] && changes["skills"].currentValue) {
      this.skills = changes["skills"].currentValue;
    }
    if (changes["shifts"] && changes["shifts"].currentValue) {
      this.shifts = changes["shifts"].currentValue;
    }
    this.ngOnInit()
  }


  ngOnInit(): void {
    this.timetable = []
    this.nbColumns = DateUtils.nbDaysDifference(this.endDate, this.startDate);
    const initHospitalDemand = {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};
    for(let i = 0; i <= this.nbColumns; i++) {
      this.timetable.push( {date: this.getDateDayStringByIndex(i), day: this.getDayString(i)});
    }
    //initiate demands
    this.hospitalDemands = new Map()
    for(const date of this.timetable){
      this.hospitalDemands.set(date, new Map());
      for (const skill of this.skills) {
        this.hospitalDemands.get(date)?.set(skill, new Map())
        for (const shift of this.shifts) {
          this.hospitalDemands.get(date)?.get(skill)?.set(shift, {demand: initHospitalDemand});
        }
      }
    }
  }

  updateDemands(date: dateDisplay, skill: string, shift: string) {
    if (!this.hospitalDemands.get(date)?.get(skill)) {
      this.hospitalDemands.get(date)?.set(skill, new Map());
    }
    const initHospitalDemand = {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};

    if (!this.hospitalDemands.get(date)?.get(skill)?.get(shift)) {
      this.hospitalDemands.get(date)?.get(skill)?.set(shift, {demand: initHospitalDemand});
    }

  const preferenceObj = this.hospitalDemands.get(date)?.get(skill)?.get(shift)
    if(preferenceObj != undefined){
      this.buttonMaxLabel = "Max: "+ preferenceObj?.demand.maxValue;
      this.buttonMinLabel = "Min: "+ preferenceObj?.demand.minValue;
    }
    this.hospitalDemands.get(date)?.get(skill)?.set(shift, { demand: this.skillDemand});
    this.emitScheduleDemand();
  }

  showToolTip(date: dateDisplay,skill: string, shift: string):string {
    const preferenceObj = this.hospitalDemands.get(date)?.get(skill)?.get(shift)
    if(preferenceObj === undefined){
      return "";
    }
    return "The Max weight is "+ preferenceObj.demand.maxWeight + " and the min weight is " + preferenceObj.demand.minWeight;
  }

  getButtonStyle(date: dateDisplay, skill: string, shift: string) {
    const demand = this.hospitalDemands.get(date)?.get(skill)?.get(shift)?.demand;
    if (demand?.maxValue === '0' &&  demand?.maxValue === '0') {
      return {'background-color': 'rgb(255, 0, 0, 0.4)' };
    } 
    return { 'background-color': 'rgb(0, 128, 0, 0.4)' };
  }


  getDateDayStringByIndex(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index) * DateUtils.dayMultiplicationFactor
    );
    const local_string = nextDay.toLocaleDateString().replaceAll("/", "-");
    return DateUtils.arrangeDateString(local_string);
  }

  getDayString(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index) * DateUtils.dayMultiplicationFactor
    ).getDay();
    return DateUtils.days[nextDay] + "\n";
  }

  emitScheduleDemand(){
    const scheduleDemand = [];
    for(const date of this.timetable){
      for (const skill of this.skills) {
        for (const shift of this.shifts) {
          const preferenceObj = this.hospitalDemands.get(date)?.get(skill)?.get(shift);
          if(preferenceObj){
          const schedule = {
              date: date.date,
              shift: shift,
              skill: skill,
              maxValue: preferenceObj.demand.maxValue,
              maxWeight: preferenceObj.demand.maxWeight,
              minValue: preferenceObj.demand.minValue,
              minWeight: preferenceObj.demand.minWeight,
            }
            scheduleDemand.push(schedule);
          }
        }
      }
    }
    this.hospitalDemand.emit(scheduleDemand);
  }

updateSkillDemandErrorState(e: boolean) {
  this.skillDemandErrorState = e;
}

}


