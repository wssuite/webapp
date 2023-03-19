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
  export class NursePreferenceComponent {
  regex = WEIGHT_ALLOWED_INTEGERS

  weight: string;
  possibleShifts: string[];
  timetable: string[];
  selectedShifts: { nurse: string, shift: string, weight: string }[] = [];
  possibleNurses: string[];
  preferences: {[date: string]: {[nurse: string]: { [shift: string]: { pref: string, weight: string }} } } = {};
  nurseSelectorFormControl = new FormControl();
  scedulePref: SchedulePref[];

  constructor() {
    this.scedulePref = [];
    this.weight = '';
    this.possibleShifts = ["early", "late", "evening", "night"];
    this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    this.possibleNurses = ["Nurse A", "Nurse B", "Nurse C", "Nurse D"];
    for(const date of this.timetable){
      this.preferences[date] = {};
      for (const nurse of this.possibleNurses) {
        this.preferences[date][nurse] = {};
        for (const shift of this.possibleShifts) {
          this.preferences[date][nurse][shift] = { pref: '', weight: '' };
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

  getButtonState(date: string, nurse: string, shift: string): string {
    if(this.preferences[date][nurse][shift].pref === 'ON') {
      return "check"
    } 
    if (this.preferences[date][nurse][shift].pref === 'OFF') {
      return "close"
    }
    return "check_box_outline_blank";
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