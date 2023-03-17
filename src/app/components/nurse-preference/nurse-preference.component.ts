// import {SelectionModel} from '@angular/cdk/collections';
 import {AfterViewInit, Component, OnInit} from '@angular/core';


@Component({
    selector: 'app-nurse-preference',
    templateUrl: './nurse-preference.component.html',
    styleUrls: ['./nurse-preference.component.css']
  })
  export class NursePreferenceComponent {
    shifts: string[];
    timetable: string[];
    buttonStates: {[key: string]: {[key: string]: string}}; // state of each button
    selectedShifts: {shift: string, date: string, weight: number}[] = []; // selected shifts and dates
    
    constructor(){
      this.buttonStates = {};
      this.shifts = ["early", "late", "evening", "night"];
      this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      for (const shift of this.shifts) {
        this.buttonStates[shift] = {}; // initialize the state of each button for this shift
        for (const date of this.timetable) {
          this.buttonStates[shift][date] = "check_box_outline_blank"; // default state
        }
      }
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
          const weight = 0.5;
          const index = this.selectedShifts.findIndex(selectedShift => 
            selectedShift.shift === shift && selectedShift.date === date);
          this.selectedShifts[index].weight = weight;
          this.buttonStates[shift][date] = "indeterminate_check_box";
          break;
        }
        case "indeterminate_check_box": {
          this.buttonStates[shift][date] = "check_box_outline_blank";
          // remove from selected shifts
          const weight = 0.5;
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
    }
  
    getButtonState(shift: string, date: string): string {
      return this.buttonStates[shift][date];
    }
  }