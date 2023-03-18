// import {SelectionModel} from '@angular/cdk/collections';
 import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { WEIGHT_ALLOWED_INTEGERS } from "src/app/constants/regex";


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
  selectedShifts: { shift: string, date: string, weight: string }[] = [];
  possibleNurses: string[];
  selectedNurse: string[] = [];
  preferences: { [shift: string]: { [date: string]: { pref: boolean, weight: string } } } = {};
  nurseSelectorFormControl = new FormControl();

  constructor() {
    this.weight = '';
    this.possibleShifts = ["early", "late", "evening", "night"];
    this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    this.possibleNurses = ["Nurse A", "Nurse B", "Nurse C", "Nurse D"];
    for (const shift of this.possibleShifts) {
      this.preferences[shift] = {};
      for (const date of this.timetable) {
        this.preferences[shift][date] = { pref: false, weight: '' };
      }
    }
  }

  updatePreferences(shift: string, date: string) {
    if (!this.preferences[shift]) {
      this.preferences[shift] = {};
    }
    if (!this.preferences[shift][date]) {
      this.preferences[shift][date] = { pref: false, weight: '' };
    }
    let pref = this.preferences[shift][date].pref;
    let weight =  this.weight;
    if(this.weight ===  this.preferences[shift][date].weight){
      pref = false;
      weight = "";
      console.log("value pref", pref)
    } else {
      pref = true;
      console.log("ici", this.weight ===  this.preferences[shift][date].weight, this.weight, this.preferences[shift][date].weight)
    }
    this.preferences[shift][date] = { pref, weight };
    console.log("nurse preference", this.preferences);
    console.log("nurse selected", this.selectedNurse);
  }

  showToolTip(shift: string, date: string):string {
    if(this.preferences[shift][date].pref) return "The weight is "+ this.preferences[shift][date].weight;
    return ""
  }

  getButtonState(shift: string, date: string): string {
    if(this.preferences[shift][date].pref === true) {
      return "indeterminate_check_box"
    }
    return "check_box_outline_blank";
  }


}

