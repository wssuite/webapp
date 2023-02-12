import { Component } from '@angular/core';
import { scheduleExample } from 'src/app/constants/schedule-example';
import { EmployeeSchedule } from 'src/app/models/Assignment';
import { APIService } from 'src/app/services/api-service/api.service';
import { DateUtils } from 'src/app/utils/DateUtils';

@Component({
  selector: 'app-consult-schedule',
  templateUrl: './consult-schedule.component.html',
  styleUrls: ['./consult-schedule.component.css']
})
export class ConsultScheduleComponent {

  employeeSchedule: EmployeeSchedule = scheduleExample
  startDate = new Date(this.employeeSchedule.startDate);
  endDate = new Date(this.employeeSchedule.endDate);
  nbColumns = DateUtils.nbDaysDifference(this.endDate, this.startDate) + 1;
  indexes: number[] = this.getIndexes()

  //schedule
  constructor(private apiService: APIService){}


  getDateDayStringByIndex(index: number):string {
    const nextDay = new Date(+this.startDate + ((index + 1)* DateUtils.dayMultiplicationFactor))
    const local_string = nextDay.toLocaleDateString().replaceAll("/", "-")
    return DateUtils.arrangeDateString(local_string)
  }

  getDayString(index:number):string {
    const nextDay = new Date(+this.startDate + ((index + 1)* DateUtils.dayMultiplicationFactor)).getDay()
    return DateUtils.days[nextDay];
  }
  getIndexes() {
    const indexes: number[] =[]
    for(let i = 0; i < this.nbColumns; i++){
      indexes.push(i);
    }
    return indexes;
  }

  getEmployeeShiftSkill(employeeName:string, index: number):string {
    let ret = ''
    for(const employeeAssignment of this.employeeSchedule.schedule){
      if(employeeAssignment.employee_name === employeeName){
        const date = this.getDateDayStringByIndex(index);
        for(const assignment of employeeAssignment.assignments){
          if(assignment.date === date) {
            console.log(date)
            ret = "skill:" + assignment.skill + "\n shift: " + assignment.shift;
            break;
          }
        }
        break;
      }
    }
    console.log(ret)
    return ret
  }
}
