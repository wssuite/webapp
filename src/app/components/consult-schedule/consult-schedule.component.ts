import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/services/api-service/api.service';

@Component({
  selector: 'app-consult-schedule',
  templateUrl: './consult-schedule.component.html',
  styleUrls: ['./consult-schedule.component.css']
})
export class ConsultScheduleComponent implements OnInit{

  greetingMessage = "";

  constructor(private apiService: APIService){}

  ngOnInit(): void {
      this.apiService.test().subscribe((res:string) => {
        this.greetingMessage = res;
      });
      console.log(this.greetingMessage);
  }

}
