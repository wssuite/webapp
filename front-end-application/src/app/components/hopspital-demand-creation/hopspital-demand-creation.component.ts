import { Component,EventEmitter,HostListener,Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import { WEIGHT_ALLOWED_INTEGERS } from 'src/app/constants/regex';
import { dateDisplay } from 'src/app/models/DateDisplay';
import { HospitalDemandElement } from 'src/app/models/GenerationRequest';
import { SkillDemandInterface } from 'src/app/models/hospital-demand';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { DateUtils } from 'src/app/utils/DateUtils';


@Component({
  selector: 'app-hopspital-demand-creation',
  templateUrl: './hopspital-demand-creation.component.html',
  styleUrls: ['./hopspital-demand-creation.component.css']
})
export class HopspitalDemandCreationComponent  implements OnInit, OnChanges, OnDestroy{
  regex = WEIGHT_ALLOWED_INTEGERS

  @Input() shifts!: string[];
  @Input() skills!: string[]; 
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Output() hospitalDemand: EventEmitter<HospitalDemandElement[]>;
  @Output() errorState: EventEmitter<boolean>;
  
  demand: SkillDemandInterface;
  skillDemandErrorState: boolean;
  saveDemandError: boolean;
  timetable: dateDisplay[];
  editOff: boolean;
  isDisabled: boolean;
  stillSelected: boolean;
  isEditing: boolean;
  hospitalDemands: Map<string, SkillDemandInterface>;
  selectedShift: Map<string, boolean>;
  nbColumns: number | undefined;

 
  constructor() {
    this.hospitalDemand = new EventEmitter();
    this.errorState = new EventEmitter();
    this.timetable = [];
    this.hospitalDemands = new Map();
    this.selectedShift = new Map();
    this.demand = {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};
    this.skillDemandErrorState = true;
    this.saveDemandError = false;
    this.editOff = true;
    this.isDisabled = true;
    this.isEditing = false;
    this.stillSelected = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const tempDemand = this.hospitalDemands;
    if (changes["skills"] && changes["skills"].currentValue) {
      this.skills = changes["skills"].currentValue;
    }
    if (changes["shifts"] && changes["shifts"].currentValue) {
      this.shifts = changes["shifts"].currentValue;
    }
    if (changes["startDate"] && changes["startDate"].currentValue) {
      this.startDate = changes["startDate"].currentValue;
      
    }
    if (changes["endDate"] && changes["endDate"].currentValue) {
      this.endDate = changes["endDate"].currentValue;
    }
    this.ngOnInit()
    for(const date of this.timetable){
      for(const skill of this.skills){
        for(const shift of this.shifts){
          const key = JSON.stringify({date: date, skill:skill,shift: shift});
          const demand = tempDemand.get(key);
          if(demand){
            this.hospitalDemands.set(key, demand);
            this.getButtonStyle(date,skill, shift)
          }
        }
      }
    }
    this.emitScheduleDemand()
  }

  ngOnDestroy(): void {
    this.saveDemand()    
  }

  ngOnInit(): void {
    this.timetable = []
    this.isDisabled = true;
    this.nbColumns = DateUtils.nbDaysDifference(this.endDate, this.startDate);
    const initSkillDemand = {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};
    for(let i = 0; i < this.nbColumns; i++) {
      this.timetable.push( {date: this.getDateDayStringByIndex(i), day: this.getDayString(i)});
    }
    //initiate demands
    this.hospitalDemands = new Map();
    this.selectedShift = new Map();
    for(const date of this.timetable){
      for (const skill of this.skills) {
        for (const shift of this.shifts) {
          this.hospitalDemands.set(JSON.stringify({date:date,skill:skill,shift:shift}),initSkillDemand);
          this.selectedShift.set(JSON.stringify({date:date,skill:skill,shift:shift}),false);
          this.getButtonStyle(date, skill, shift) 
        }
      }
    }
    const savedDemand = CacheUtils.getDemandGenerationRequest()
    if(savedDemand){
      savedDemand.forEach((demand: HospitalDemandElement)=>{
        this.timetable.forEach((time: dateDisplay)=>{
          if(demand.date === time.date){
            const hd = this.hospitalDemands.get(JSON.stringify({date: time, skill: demand.skill, shift: demand.shift}))
            if(hd){
              const value = {maxValue: demand.maxValue,  maxWeight: demand.maxWeight, minValue: demand.minValue,  minWeight: demand.minWeight}
              const key = JSON.stringify({date: time, skill: demand.skill, shift: demand.shift})
              this.hospitalDemands.set(key, value)
              this.getButtonStyle(time, demand.skill, demand.shift)
            }
          }
        })
      })
    }
    this.emitScheduleDemand()
  }

 displayValue(date: dateDisplay, skill: string, shift: string){
    const key = JSON.stringify({date:date,skill:skill,shift:shift});
    const min = this.hospitalDemands.get(key)?.minValue;
    const max = this.hospitalDemands.get(key)?.maxValue;
    return "Min: " + min + '\n' + "Max: " + max;
  }

  setSelection(date: dateDisplay, skill: string, shift: string){
    const key = JSON.stringify({date:date,skill:skill,shift:shift});
    if(this.selectedShift.get(key) === true){
      this.selectedShift.set(key,false);
    }
    else{
      this.selectedShift.set(key,true);
      

    }
    if(!this.isEditing){
      const demand = this.hospitalDemands.get(key);
      if(demand !== undefined) {
        this.demand = {...demand};
      }
    }
    this.stillSelected = false;
    for (const key of this.selectedShift.keys()){
      if(this.selectedShift.get(key) === true){
        this.editOff = false;
        this.saveDemandError = true;
        this.stillSelected = true;
      }
    }

    if(!this.stillSelected){
      this.editOff = true;
      this.isDisabled = true;
      this.isEditing = false;
    }

  }

  setEdition(){ 
    this.isDisabled = false;
    this.isEditing = true;
  }

  save(){
    this.editOff = true;
    this.isDisabled = true;
    this.isEditing = false;
    const demand = this.demand;
    for (const key of this.selectedShift.keys()){
      if(this.selectedShift.get(key) === true){
        this.hospitalDemands.set(key, demand);
      }
      this.selectedShift.set(key,false);
    }
    this.saveDemandError = false;
    this.emitScheduleDemand();
  }


  showToolTip(date: dateDisplay,skill: string, shift: string):string {
    const key = JSON.stringify({date:date,skill:skill,shift:shift});
    const preferenceObj = this.hospitalDemands.get(key);
    if(preferenceObj === undefined){
      return "";
    }
    return "The Max weight is "+ preferenceObj.maxWeight + " and the min weight is " + preferenceObj.minWeight;
  }

  getWeight(date: dateDisplay,skill: string, shift: string): string {
    const key = JSON.stringify({date:date,skill:skill,shift:shift});
    const preferenceObj = this.hospitalDemands.get(key);
    if(preferenceObj === undefined){
      return "";
    }
    if(preferenceObj.maxWeight === "0" && preferenceObj.minWeight === "0"){
      return "";
    }
    else{
      return "The Max weight is "+ preferenceObj.maxWeight + " and the min weight is " + preferenceObj.minWeight;
    }
  }

  getDateDayStringByIndex(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index) * DateUtils.dayMultiplicationFactor
    );
    const local_string = nextDay.toISOString().split("T")[0];
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

  getButtonStyle(date: dateDisplay, skill: string, shift: string) {
    const key = JSON.stringify({date:date,skill:skill,shift:shift});
    const selected = this.selectedShift.get(key);
    if (selected) {
      return { 'border-radius': '3px','border': '3px solid darkgray',  'content':'goodbye', 'visibility': 'visible'};
    } 
    return { 'border-radius': '0px','border': '0px'};
  } 


  emitScheduleDemand(){
    const scheduleDemand = [];
    for(const date of this.timetable){
      for (const skill of this.skills) {
        for (const shift of this.shifts) {
          const key = JSON.stringify({date:date,skill:skill,shift:shift});
          const preferenceObj = this.hospitalDemands.get(key);
          if(preferenceObj){
          const schedule = {
              date: date.date,
              shift: shift,
              skill: skill,
              maxValue: preferenceObj.maxValue,
              maxWeight: preferenceObj.maxWeight,
              minValue: preferenceObj.minValue,
              minWeight: preferenceObj.minWeight,
            }
            scheduleDemand.push(schedule);
          }
        }
      }
    }
    this.hospitalDemand.emit(scheduleDemand);
    this.emitErrorState(); 
  }

  updateSkillDemandErrorState(e: boolean) {
    this.skillDemandErrorState = e;
  }

  emitErrorState(){
    this.errorState.emit(this.saveDemandError);
  }

  @HostListener("window:beforeunload")
  saveDemand(){
    const scheduleDemand = [];
    for(const date of this.timetable){
      for (const skill of this.skills) {
        for (const shift of this.shifts) {
          const key = JSON.stringify({date:date,skill:skill,shift:shift});
          const preferenceObj = this.hospitalDemands.get(key);
          if(preferenceObj){
          const schedule = {
              date: date.date,
              shift: shift,
              skill: skill,
              maxValue: preferenceObj.maxValue,
              maxWeight: preferenceObj.maxWeight,
              minValue: preferenceObj.minValue,
              minWeight: preferenceObj.minWeight,
            }
            scheduleDemand.push(schedule);
          }
        }
      }
    }
    CacheUtils.setDemandGenerationRequest(scheduleDemand);
  }

  getDisplayedDate(date: string){
    try{
      const dateSplitted = date.split("-")
      return `${dateSplitted[1]}/${dateSplitted[2]}`
    }catch(err){
      return ""
    }
  }
}


