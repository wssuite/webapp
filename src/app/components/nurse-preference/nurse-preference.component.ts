import { Component } from '@angular/core';

@Component({
  selector: 'app-nurse-preference',
  templateUrl: './nurse-preference.component.html',
  styleUrls: ['./nurse-preference.component.css']
})
export class NursePreferenceComponent {
  shift: string[];
  timetable: string[];
  
  constructor() {
    this.shift = ["early", "late", "evening", "night"];
    this.timetable = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    console.log(this.timetable.length)
  }

}
