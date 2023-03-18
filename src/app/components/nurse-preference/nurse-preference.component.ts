// import {SelectionModel} from '@angular/cdk/collections';
 import {AfterViewInit, Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';


@Component({
    selector: 'app-nurse-preference',
    templateUrl: './nurse-preference.component.html',
    styleUrls: ['./nurse-preference.component.css']
  })
  export class NursePreferenceComponent {
    possibleShifts: string[];
    timetable: string[];
    buttonStates: {[key: string]: {[key: string]: string}}; // state of each button
    selectedShifts: {shift: string, date: string, weight: number}[] = []; // selected shifts and dates
    possibleNurses = ["Nurse A", "Nurse B", "Nurse C", "Nurse D"];
    nurse: string[] = [];
    nursePreferences: {[key: string]: {[key: string]: number}} = {}; // nurse preferences
    nurseSelectorFormControl = new FormControl();
  
    constructor(){
      this.buttonStates = {};
      this.possibleShifts = ["early", "late", "evening", "night"];
      this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      for (const shift of this.possibleShifts){
        this.buttonStates[shift] = {}; // initialize the state of each button for this shift
        for (const date of this.timetable) {
          this.buttonStates[shift][date] = "check_box_outline_blank"; // default state
        }
      }
      this.updateNursePreferences(); // initialize the nurse preferences
    }
  
    changeButtonState(shift: string, date: string) {
      const currentState = this.buttonStates[shift][date];
      switch(currentState){
        case "check_box_outline_blank": {
          this.buttonStates[shift][date] = "check_box";
          const weight = 1;
          this.selectedShifts.push({shift, date, weight}); // add to selected shifts
          break;
        }
        case "check_box": {
          this.buttonStates[shift][date] = "indeterminate_check_box";
          const weight = 0.5;
          const index = this.selectedShifts.findIndex(selectedShift => 
            selectedShift.shift === shift && selectedShift.date === date);
          this.selectedShifts[index].weight = weight; // update weight
          break;
        }
        case "indeterminate_check_box": {
          this.buttonStates[shift][date] = "check_box_outline_blank";
          // remove from selected shifts
          const index = this.selectedShifts.findIndex(selectedShift => 
            selectedShift.shift === shift && selectedShift.date === date);
          this.selectedShifts.splice(index, 1);
          break;
        }
        default: {
          this.buttonStates[shift][date] = "check_box_outline_blank";
          break;
        }
      }
      console.log("shift selected", this.selectedShifts);
      this.updateNursePreferences(); // update nurse preferences when selected shifts change
    }
  
    getButtonState(shift: string, date: string): string {
      return this.buttonStates[shift][date];
    }
  
    emitElement() {
      console.log("Nurse selected: ", this.nurse);
      this.updateNursePreferences(); // update nurse preferences when nurse selection changes
    }
  
    updateNursePreferences() {
      // reset nurse preferences
      this.nursePreferences = {};
      for (const nurse of this.nurse) {
        this.nursePreferences[nurse] = {};
        for (const shift of this.possibleShifts) {
          for (const date of this.timetable) {
            const selectedShift = this.selectedShifts.find(selectedShift => 
              selectedShift.shift === shift && selectedShift.date === date);
            const weight = selectedShift ? selectedShift.weight : 0;
            this.nursePreferences[nurse][`${shift}_${date}`] = weight;
          }
        }
      }
      console.log("nursePreferences", this.nursePreferences)
    }
  }
  