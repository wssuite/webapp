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
  @Output() hospitalDemand: EventEmitter<HospitalDemandElement[][]>;
  @Output() errorState: EventEmitter<boolean>;

  minMaxDemand: SkillDemandInterface;
  skillDemandErrorState: boolean;
  saveDemandError: boolean;
  timetable: dateDisplay[];
  editOff: boolean;
  isDisabled: boolean;
  stillSelected: boolean;
  isEditing: boolean;
  indices: number[];
  demand: Map<string, SkillDemandInterface>[];
  selectedShift: Map<string, boolean>[];
  nbColumns: number | undefined;


  constructor() {
    this.hospitalDemand = new EventEmitter();
    this.errorState = new EventEmitter();
    this.timetable = [];
    this.indices = [];
    this.demand = [];
    this.selectedShift = [];
    this.minMaxDemand= {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};
    this.skillDemandErrorState = true;
    this.saveDemandError = false;
    this.editOff = true;
    this.isDisabled = true;
    this.isEditing = false;
    this.stillSelected = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const tempDemand = this.demand;
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
    for(let i = 0; i < tempDemand.length; i++) {
      const tmpDemand = tempDemand[i];
      for(const date of this.timetable){
        for(const skill of this.skills){
          for(const shift of this.shifts){
            const key = this.getKey(date,skill,shift);
            const d = tmpDemand.get(key);
            if(d){
              this.demand[i].set(key, d);
              this.getButtonStyleKey(i, key)
            }
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
    for(let i = 0; i < this.nbColumns; i++) {
      this.timetable.push( {date: this.getDateDayStringByIndex(i), day: this.getDayString(i)});
    }
    // initialize demands
    const savedDemand = CacheUtils.getDemandGenerationRequest();
    const size = Math.max(1, this.indices.length, savedDemand.length);
    this.indices = [];
    this.demand = [];
    this.selectedShift = [];
    for (let i = 0; i < size; i++) {
      this.addIndex();
    }

    if(savedDemand.length > 0){
      for (const i of this.indices) {
        savedDemand[i].forEach((d: HospitalDemandElement)=>{
          this.timetable.forEach((time: dateDisplay)=>{
            if(d.date === time.date){
              const key = this.getKey(time,d.skill,d.shift);
              const hd = this.demand[i].get(key)
              if(hd) {
                const value = {maxValue: d.maxValue,  maxWeight: d.maxWeight, minValue: d.minValue,  minWeight: d.minWeight}
                this.demand[i].set(key, value)
                this.getButtonStyleKey(i, key)
              }
            }
          })
        })
      }
    }
    this.emitScheduleDemand()
  }

  initializeDemand(index: number) {
    const initSkillDemand = {maxValue: '0',  maxWeight: '0', minValue: '0',  minWeight: '0'};
    for(const date of this.timetable){
      for (const skill of this.skills) {
        for (const shift of this.shifts) {
          const key = this.getKey(date,skill,shift);
          this.demand[index].set(key,initSkillDemand);
          this.selectedShift[index].set(key,false);
          this.getButtonStyleKey(index,key)
        }
      }
    }
  }

 displayValue(index: number, date: dateDisplay, skill: string, shift: string){
    const key = this.getKey(date,skill,shift);
    const min = this.demand[index].get(key)?.minValue;
    const max = this.demand[index].get(key)?.maxValue;
    return "Min: " + min + '\n' + "Max: " + max;
  }

  setSelection(index: number, date: dateDisplay, skill: string, shift: string){
    const key = this.getKey(date,skill,shift);
    if(this.selectedShift[index].get(key) === true){
      this.selectedShift[index].set(key,false);
    }
    else{
      this.selectedShift[index].set(key,true);
    }
    if(!this.isEditing){
      const d = this.demand[index].get(key);
      if(d!== undefined) {
        this.minMaxDemand = {...d};
      }
    }
    this.stillSelected = false;
    for (const i of this.indices) {
      for (const key of this.selectedShift[i].keys()){
        if(this.selectedShift[i].get(key) === true){
          this.editOff = false;
          this.saveDemandError = true;
          this.stillSelected = true;
        }
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
    const minMaxDemand = this.minMaxDemand;
    for (const i of this.indices) {
      for (const key of this.selectedShift[i].keys()){
        if(this.selectedShift[i].get(key) === true){
          this.demand[i].set(key, minMaxDemand);
        }
        this.selectedShift[i].set(key,false);
      }
    }
    this.saveDemandError = false;
    this.emitScheduleDemand();
  }


  showToolTip(index: number, date: dateDisplay, skill: string, shift: string):string {
    const key = this.getKey(date,skill,shift);
    const hObj = this.demand[index].get(key);
    if(hObj === undefined){
      return "";
    }
    return "The Max weight is "+ hObj.maxWeight + " and the min weight is " + hObj.minWeight;
  }

  getWeight(index: number, date: dateDisplay,skill: string, shift: string): string {
    const key = this.getKey(date,skill,shift);
    const hObj = this.demand[index].get(key);
    if(hObj === undefined){
      return "";
    }
    if(hObj.maxWeight === "0" && hObj.minWeight === "0"){
      return "";
    } else {
      return "The Max weight is "+ hObj.maxWeight + " and the min weight is " + hObj.minWeight;
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

  getButtonStyle(index: number, date: dateDisplay,skill: string, shift: string) {
    const key = this.getKey(date,skill,shift);
    return this.getButtonStyleKey(index, key);
  }

  getButtonStyleKey(index: number, key: string) {
    const selected = this.selectedShift[index].get(key);
    if (selected) {
      return { 'border-radius': '3px','border': '3px solid darkgray',  'content':'goodbye', 'visibility': 'visible'};
    }
    return { 'border-radius': '0px','border': '0px'};
  }

  getKey(date: dateDisplay, skill: string, shift: string) {
    return JSON.stringify({date:date,skill:skill,shift:shift});
  }

  emitScheduleDemand(){
    const scheduleDemand = this.getDemandArray();
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
    const scheduleDemand = this.getDemandArray();
    CacheUtils.setDemandGenerationRequest(scheduleDemand);
  }

  getDemandArray(): HospitalDemandElement[][] {
    const scheduleDemand = [];
    for (const i of this.indices) {
      const cDemand = this.demand[i];
      const tmpDemand = [];
      for(const date of this.timetable){
        for (const skill of this.skills) {
          for (const shift of this.shifts) {
            const key = this.getKey(date,skill,shift);
            const hObj = cDemand.get(key);
            if(hObj){
              const schedule = {
                index: i,
                date: date.date,
                shift: shift,
                skill: skill,
                maxValue: hObj.maxValue,
                maxWeight: hObj.maxWeight,
                minValue: hObj.minValue,
                minWeight: hObj.minWeight,
              }
              tmpDemand.push(schedule);
            }
          }
        }
      }
      scheduleDemand.push(tmpDemand);
    }
    return scheduleDemand;
  }

  getDisplayedDate(date: string){
    try{
      const dateSplitted = date.split("-")
      return `${dateSplitted[1]}/${dateSplitted[2]}`
    }catch(err){
      return ""
    }
  }

  addIndex() {
    this.demand.push(new Map());
    this.selectedShift.push(new Map());
    this.initializeDemand(this.indices.length);
    this.indices.push(this.indices.length);
  }

  deleteIndex(index: number) {
    this.demand.splice(index, 1);
    this.selectedShift.splice(index, 1);
    this.indices = [...Array(this.indices.length-1).keys()];
  }

  cancel(){
    this.editOff = true
    this.isDisabled = true;
    this.isEditing = false;
    this.stillSelected = false;
    for (const i of this.indices) {
      for(const key of this.selectedShift[i].keys()){
        this.selectedShift[i].set(key, false)
      }
    }
  }
}
