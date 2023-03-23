
import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormControl } from "@angular/forms";
import { WEIGHT_ALLOWED_INTEGERS } from "src/app/constants/regex";
import { NurseInterface } from "src/app/models/Nurse";


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
  

  constructor() {
    this.scedulePref = [];
    this.weight = '';
    this.possibleShifts = this.shifts;
    this.timetable = ["Monday, April 3, 2023", "Tuesday, April 4, 2023", "Wednesday, April 5, 2023", "Thursday, April 6, 2023", "Friday, April 7, 2023", "Saturday, April 8, 2023", "Sunday, April 9, 2023"];
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