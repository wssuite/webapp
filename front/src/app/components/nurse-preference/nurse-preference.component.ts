
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { WEIGHT_ALLOWED_INTEGERS } from "src/app/constants/regex";
import { dateDisplay } from "src/app/models/DateDisplay";
import { SchedulePreferenceElement } from "src/app/models/GenerationRequest";
import { NurseInterface } from "src/app/models/Nurse";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { DateUtils } from "src/app/utils/DateUtils";


@Component({
    selector: 'app-nurse-preference',
    templateUrl: './nurse-preference.component.html',
    styleUrls: ['./nurse-preference.component.css']
  })
  export class NursePreferenceComponent implements OnInit, OnChanges, OnDestroy{
  regex = WEIGHT_ALLOWED_INTEGERS

  weight: string;
  weightLabel: string;
  @Input() shifts!: string[];
  @Input() nurses!: NurseInterface[];
  @Input() startDate!: Date;
  @Input() endDate!: Date;
  @Output() schedulePreference: EventEmitter<SchedulePreferenceElement[]>

  timetable: dateDisplay[];
  preferences: Map<string, Map<string,Map<string, {pref: string, weight: string}>>>;
  nbColumns: number | undefined;


  constructor() {
    this.schedulePreference = new EventEmitter();
    this.weight = '';
    this.weightLabel = 'Preference Weight'
    this.timetable = [];
    this.preferences = new Map();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const preferencesClone = this.preferences;
    if (changes["nurses"] && changes["nurses"].currentValue) {
      this.nurses = changes["nurses"].currentValue;
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
    console.log(preferencesClone)
    this.ngOnInit()
    console.log(preferencesClone)
    for(const date of this.timetable){
      for(const nurse of this.nurses){
        for(const shift of this.shifts){
          const savedPref = preferencesClone.get(JSON.stringify(date))?.get(nurse.username)?.get(shift)
          if(savedPref){
            this.preferences.get(JSON.stringify(date))?.get(nurse.username)?.set(shift, savedPref)
          }
        }
      }
    }
    this.getButtonState();
    this.emitSchedulePref()
  }

  ngOnDestroy(): void {
      this.savePreferences()
  }

  ngOnInit(): void {
    this.timetable = []
    this.nbColumns = DateUtils.nbDaysDifference(this.endDate, this.startDate);
    for(let i = 0; i < this.nbColumns; i++) {
      this.timetable.push( {date: this.getDateDayStringByIndex(i), day: this.getDayString(i)});
    }
    //initiate preferences
    this.preferences = new Map()
    for(const date of this.timetable){
      this.preferences.set(JSON.stringify(date), new Map());
      for (const nurse of this.nurses) {
        this.preferences.get(JSON.stringify(date))?.set(nurse.username, new Map())
        for (const shift of this.shifts) {
          this.preferences.get(JSON.stringify(date))?.get(nurse.username)?.set(shift, { pref: '', weight: '' })
        }
      }
    }
    const savedPreferences = CacheUtils.getGenerationRequestPreferences()
    if(savedPreferences){
      savedPreferences.forEach((pref:SchedulePreferenceElement)=>{
        this.timetable.forEach((time: dateDisplay)=>{
          if(pref.date === time.date){
            const prefElement = this.preferences.get(JSON.stringify(time))?.get(pref.username)?.get(pref.shift)
            if(prefElement){
              this.preferences.get(JSON.stringify(time))?.get(pref.username)?.set(pref.shift, {pref: pref.preference, weight: pref.weight})
              this.weight = pref.weight
            }
          }
        })
      })
    }
    this.emitSchedulePref()
  }

  updatePreferences(date: dateDisplay, nurse: string, shift: string) {
    if (!this.preferences.get(JSON.stringify(date))?.get(nurse)) {
      this.preferences.get(JSON.stringify(date))?.set(nurse, new Map());
    }

    if (!this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)) {
      this.preferences.get(JSON.stringify(date))?.get(nurse)?.set(shift,{ pref: '', weight: '' });
    }
    let pref = this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)?.pref;
    let weight =  this.weight;

    if(this.weight ===  this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)?.weight){
      if(this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)?.pref === 'ON') {
        pref = 'OFF';
      } else {
        pref = '';
        weight = "";
      }
    } else { pref = 'ON';}

    this.preferences.get(JSON.stringify(date))?.get(nurse)?.set(shift, { pref, weight });
    this.emitSchedulePref();
  }

  showToolTip(date: dateDisplay,nurse: string, shift: string):string {
    const preferenceObj = this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)
    if(preferenceObj === undefined){
      return "";
    }
    return "The weight is "+ preferenceObj.weight
  }

  getWeight(date: dateDisplay,nurse: string, shift: string):string{
    const preferenceObj = this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)
    if(preferenceObj === undefined){
      return "";
    }
    return preferenceObj.weight;
  }

  getButtonState(date?: dateDisplay, nurse?: string, shift?: string): string {
    if(date !== undefined && nurse !==  undefined && shift !==  undefined) {
    if(this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)?.pref === 'ON') {
      return "check"
    }
    if (this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)?.pref === 'OFF') {
      return "close"
    }
    return "check_box_outline_blank";
  }
  return "check_box_outline_blank";
  }

  getButtonStyle(date: dateDisplay, nurse: string, shift: string) {
    const pref = this.preferences.get(JSON.stringify(date))?.get(nurse)?.get(shift)?.pref;
    if (pref === 'ON') {
      return {'background-color': 'rgb(228, 241, 226)' };
    } else if (pref === 'OFF') {
      return {'background-color': 'rgb(246, 233, 232)' };
    }
    return { 'background-color': 'rgb(235, 234, 234)' };
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

  getDisplayedDate(date: string){
    const dateSplitted = date.split("-")
    return `${dateSplitted[1]}/${dateSplitted[2]}`
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

  emitSchedulePref(){
    const scedulePref = [];
    for(const date of this.timetable){
      for (const nurse of this.nurses) {
        for (const shift of this.shifts) {
          const preferenceObj = this.preferences.get(JSON.stringify(date))?.get(nurse.username)?.get(shift)
          if( preferenceObj && (preferenceObj.pref === 'OFF' ||
              preferenceObj.pref === 'ON')){
            const schedule = {
              date: date.date,
              username: nurse.username,
              preference: preferenceObj.pref,
              shift: shift,
              weight: preferenceObj.weight
            }
            scedulePref.push(schedule);
          }
        }
      }
    }
    this.schedulePreference.emit(scedulePref);
  }

  @HostListener("window:beforeunload")
  savePreferences(){
    const scedulePref = [];
    for(const date of this.timetable){
      for (const nurse of this.nurses) {
        for (const shift of this.shifts) {
          const preferenceObj = this.preferences.get(JSON.stringify(date))?.get(nurse.username)?.get(shift)
          if( preferenceObj && (preferenceObj.pref === 'OFF' ||
              preferenceObj.pref === 'ON')){
            const schedule = {
              date: date.date,
              username: nurse.username,
              preference: preferenceObj.pref,
              shift: shift,
              weight: preferenceObj.weight
            }
            scedulePref.push(schedule);
          }
        }
      }
    }
    CacheUtils.setGenerationRequestPreferences(scedulePref)
  }
}
