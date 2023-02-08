import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-schedule-generation',
  templateUrl: './schedule-generation.component.html',
  styleUrls: ['./schedule-generation.component.css']
})
export class ScheduleGenerationComponent {
  startDate:Date
  todayDate: Date
  range = new FormGroup(
    {
      start: new FormControl(null, Validators.required),
      end: new FormControl(null, Validators.required)
    }
  );

  endDate: Date

  problemName: string

  constructor(){
    this.startDate = new Date() 
    this.problemName = ""
    this.endDate = new Date()
    this.todayDate = new Date()
  }

}
