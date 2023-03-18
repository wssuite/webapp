// import {SelectionModel} from '@angular/cdk/collections';
 import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'app-nurse-preference',
    templateUrl: './nurse-preference.component.html',
    styleUrls: ['./nurse-preference.component.css']
  })
  export class NursePreferenceComponent {
    weight: string;
    possibleShifts: string[];
    timetable: string[];
    selectedShifts: {shift: string, date: string, weight: string}[] = [];
    possibleNurses: string [];
    selectedNurse: string[] = [];
    schedulePreference: {[key: string]: {[key: string]: {pref:boolean, weight: string}}} = {};
    nurseSelectorFormControl = new FormControl();
  
    constructor(){
      this.weight = '';
      this.possibleShifts = ["early", "late", "evening", "night"];
      this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      this.possibleNurses = ["Nurse A", "Nurse B", "Nurse C", "Nurse D"];
    }

    updatePreferences( shift: string, date: string, checked: boolean) {
        if (!this.schedulePreference[shift]) {
          this.schedulePreference[shift] = {};
        }
        const weight = checked ? this.weight : '';
        this.schedulePreference[shift][date] = { pref: checked, weight };
      console.log("nurse preference", this.schedulePreference);
      console.log("nurse selected", this.selectedNurse);
    }
  }
  