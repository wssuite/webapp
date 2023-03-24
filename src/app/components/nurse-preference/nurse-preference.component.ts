
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormControl } from "@angular/forms";
import { WEIGHT_ALLOWED_INTEGERS } from "src/app/constants/regex";
import { NurseInterface } from "src/app/models/Nurse";
import { DateUtils } from "src/app/utils/DateUtils";


interface  SchedulePref
  {
      preference_date: string,
      preference_username: string,
      preference_pref: string,
      preference_shift: string,
      preference_weight: string,
  }


@Component({
    selector: 'app-nurse-preference',
    templateUrl: './nurse-preference.component.html',
    styleUrls: ['./nurse-preference.component.css']
  })
  export class NursePreferenceComponent implements OnInit, OnChanges{
  regex = WEIGHT_ALLOWED_INTEGERS

  weight: string;
  @Input() shifts!: string[];
  @Input() nurses!: NurseInterface[]; 
  @Input() startDate!: Date;
  @Input() endDate!: Date;

  timetable: string[];
  selectedShifts: { nurse: string, shift: string, weight: string }[] = [];
  possibleNurses: NurseInterface[];
  possibleShifts: string[];
  preferences: {[date: string]: {[nurse: string]: { [shift: string]: { pref: string, weight: string }} } } = {};
  nurseSelectorFormControl = new FormControl();
  scedulePref: SchedulePref[];

  nbColumns: number | undefined;
  

  constructor() {
    this.scedulePref = [];
    this.weight = '';
    this.possibleShifts = this.shifts;
    this.timetable = [];
    this.possibleNurses = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["nurses"] && changes["nurses"].currentValue) {
      this.possibleNurses = changes["nurses"].currentValue;
    }
    if (changes["shifts"] && changes["shifts"].currentValue) {
      this.possibleShifts = changes["shifts"].currentValue;
    }
    this.getButtonState();
  }


  ngOnInit(): void {
    this.nbColumns = DateUtils.nbDaysDifference(this.endDate, this.startDate) + 1;
    for(let i = 0; i <= this.nbColumns; i++) {
      this.timetable.push(this.getDayString(i) + this.getDateDayStringByIndex(i));
    }
    //initiate preferences
    for(const date of this.timetable){
      this.preferences[date] = {};
      for (const nurse of this.possibleNurses) {
        this.preferences[date][nurse.username] = {};
        for (const shift of this.possibleShifts) {
          this.preferences[date][nurse.username][shift] = { pref: '', weight: '' };
        }
      }
    }
  }

  updatePreferences(date: string, nurse: string, shift: string) {
    if (!this.preferences[nurse]) {
      this.preferences[nurse] = {};
    }
    if (!this.preferences[date][nurse][shift]) {
      this.preferences[date][nurse][shift] = { pref: '', weight: '' };
    }
    let pref = this.preferences[date][nurse][shift].pref;
    let weight =  this.weight;
    if(this.weight ===  this.preferences[date][nurse][shift].weight){
      if(this.preferences[date][nurse][shift].pref === 'ON') {
        pref = 'OFF';
      } else {
        pref = '';
        weight = "";
      }
      
      
    } else {
      pref = 'ON';
    }
    this.preferences[date][nurse][shift] = { pref, weight };
    console.log(this.preferences);
    this.emitSchedulePref();
  }

  showToolTip(date: string,nurse: string, shift: string):string {
    if(this.preferences[date][nurse][shift].pref) return "The weight is "+ this.preferences[date][nurse][shift].weight;
    return ""
  }

  getButtonState(date?: string, nurse?: string, shift?: string): string {
    if(date !== undefined && nurse !==  undefined && shift !==  undefined) {
    if(this.preferences[date][nurse][shift].pref === 'ON') {
      return "check"
    } 
    if (this.preferences[date][nurse][shift].pref === 'OFF') {
      return "close"
    }
    return "check_box_outline_blank";
  }
  return "check_box_outline_blank";
  }

  getButtonStyle(date: string, nurse: string, shift: string) {
      const pref = this.preferences[date][nurse][shift].pref;
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
      +this.startDate + (index + 1) * DateUtils.dayMultiplicationFactor
    );
    const local_string = nextDay.toLocaleDateString().replaceAll("/", "-");
    return DateUtils.arrangeDateString(local_string);
  }

  getDayString(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const nextDay = new Date(
      +this.startDate + (index + 1) * DateUtils.dayMultiplicationFactor
    ).getDay();
    return DateUtils.days[nextDay] + "\n";
  }

  emitSchedulePref(){
    this.scedulePref = [];
    for(const date of this.timetable){
      for (const nurse of this.possibleNurses) {
        for (const shift of this.possibleShifts) {
          if(this.preferences[date][nurse.username][shift].pref === 'OFF' || this.preferences[date][nurse.username][shift].pref === 'ON'){
            const schedule = {
              preference_date: date, 
              preference_username: nurse.username, 
              preference_pref: this.preferences[date][nurse.username][shift].pref,
              preference_shift: shift,
              preference_weight: this.preferences[date][nurse.username][shift].weight
            }
            this.scedulePref.push(schedule);
          }
        }
      }
    }
    console.log("emit schedule", this.scedulePref)
  }
}