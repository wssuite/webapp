import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WEIGHT_ALLOWED_INTEGERS } from "src/app/constants/regex";


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
  export class NursePreferenceComponent implements OnInit {
  regex = WEIGHT_ALLOWED_INTEGERS

  weight: string;
  possibleShifts: string[];

  timetable: string[];
  selectedShifts: { nurse: string, shift: string, weight: string }[] = [];
  possibleNurses: string[];
  preferences: {[date: string]: {[nurse: string]: { [shift: string]: { pref: string, weight: string }} } } = {};
  stateButtonAllNurse: {[nurse: string]:{ pref: string, weight: string }} = {};
  nurseSelectorFormControl = new FormControl();
  scedulePref: SchedulePref[];
  

  constructor() {
    this.scedulePref = [];
    this.weight = '';
    this.possibleShifts = ["early", "late", "evening", "night"];
    this.timetable = ["Monday, April 3, 2023", "Tuesday, April 4, 2023", "Wednesday, April 5, 2023", "Thursday, April 6, 2023", "Friday, April 7, 2023", "Saturday, April 8, 2023", "Sunday, April 9, 2023"];
    this.possibleNurses = ["Nurse A", "Nurse B", "Nurse C", "Nurse D"];
  }

  ngOnInit(): void {
    //initiate preferences
    for(const date of this.timetable){
      this.preferences[date] = {};
      for (const nurse of this.possibleNurses) {
        this.preferences[date][nurse] = {};
        this.stateButtonAllNurse[nurse] = {pref: '', weight: ''};
        for (const shift of this.possibleShifts) {
          this.preferences[date][nurse][shift] = { pref: '', weight: '' };
        }
      }
    }
  }

  updatePreferences(date: string, nurse: string, shift: string, allNurse = false, newPref= '', newWeight='') {
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
    if (allNurse) {
      console.log(newPref)
      for (const shift of this.possibleShifts) {
        
        this.preferences[date][nurse][shift] = { pref: newPref, weight: newWeight };
      }
    } else {
      this.preferences[date][nurse][shift] = { pref, weight };
    }
    this.emitSchedulePref();
  }
  updateAllPreferences(nurse: string) {
    let newPref = this.stateButtonAllNurse[nurse].pref;
    let newWeight =  this.weight;
    console.log("weight", this.stateButtonAllNurse[nurse].weight )
    if(this.weight ===  this.stateButtonAllNurse[nurse].weight){
      console.log("here",this.stateButtonAllNurse[nurse].pref)
      if(this.stateButtonAllNurse[nurse].pref === 'ON') {
        newPref  = 'OFF';
      } else {
        newPref  = '';
        newWeight = "";
      }
    } else {
      newPref  = 'ON';
    }
    this.stateButtonAllNurse[nurse] = {pref: newPref, weight: newWeight}
    for(const date of this.timetable){
      for (const shift of this.possibleShifts) {
        this.updatePreferences(date, nurse, shift, true, newPref, newWeight);
      }}
  }

  showToolTip(date: string,nurse: string, shift: string):string {
    if(this.preferences[date][nurse][shift].pref) return "The weight is "+ this.preferences[date][nurse][shift].weight;
    return ""
  }

  getButtonState(date: string, nurse: string, shift: string): string {
    if(this.preferences[date][nurse][shift].pref === 'ON') {
      return "check"
    } 
    if (this.preferences[date][nurse][shift].pref === 'OFF') {
      return "close"
    }
    return "check_box_outline_blank";
  }

  getButtonStyleAllNurse( nurse: string) {
    const pref = this.stateButtonAllNurse[nurse].pref;
    if (pref === 'ON') {
      return {'background-color': 'rgb(228, 241, 226)' };
    } else if (pref === 'OFF') {
      return {'background-color': 'rgb(246, 233, 232)' };
    }
    return { 'background-color': 'rgb(235, 234, 234)' };
  }

  getButtonStateAllNurse(nurse: string): string {
    if(this.stateButtonAllNurse[nurse].pref === 'ON') {
      return "check"
    } 
    if (this.stateButtonAllNurse[nurse].pref === 'OFF') {
      return "close"
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
          if(this.preferences[date][nurse][shift].pref === 'OFF' || this.preferences[date][nurse][shift].pref === 'ON'){
            const schedule = {
              preference_date: date, 
              preference_username: nurse, 
              preference_pref: this.preferences[date][nurse][shift].pref,
              preference_shift: shift,
              preference_weight: this.preferences[date][nurse][shift].weight
            }
            this.scedulePref.push(schedule);
          }
        }
      }
    }
    console.log("emit schedule", this.scedulePref)
  }
}