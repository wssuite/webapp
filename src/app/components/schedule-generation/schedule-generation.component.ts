import { Component} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Nurse } from 'src/app/models/Nurse';

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
  nurses: Nurse[]

  constructor(){
    this.startDate = new Date() 
    this.problemName = ""
    this.endDate = new Date()
    this.todayDate = new Date()
    this.nurses = [new Nurse()]
  }

  updateStartDate(e:MatDatepickerInputEvent<Date>){
    this.startDate = (e.value!=null && e.value!=undefined)? this.startDate=e.value: this.startDate=new Date()
  }

  updateEndDate(e:MatDatepickerInputEvent<Date>){
    this.endDate = (e.value!=null && e.value!=undefined)? this.endDate=e.value: this.endDate=new Date()
  }

  addNurse() {
    this.nurses.push(new Nurse());
  }

  removeNurse() {
    this.nurses.pop();
  }
}
