import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Solution } from 'src/app/models/Schedule';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ScheduleService } from 'src/app/services/schedule/schedule-service.service';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { saveAs } from 'file-saver';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Router } from '@angular/router';
import { SCHEDULE_GENERATION } from 'src/app/constants/app-routes';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.css']
})
export class SchedulesGalleryComponent implements OnInit, AfterViewInit{
  connectedUser: boolean;
  schedules: Solution[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<Solution>

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ScheduleService,
     private dialog: MatDialog, private profileService: ProfileService,
     private router: Router){
    this.connectedUser = false;
    this.schedules = []
    this.displayedColumns = ["startDate", "endDate", "versionNumber", "state", "actions"]
    this.dataSource = new MatTableDataSource();
  }
  
  ngOnInit(): void {
    try{
      this.getSchedules();
      this.connectedUser = true;
    } catch(err) {
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getSchedules();
    })
    this.dataSource.paginator = this.paginator;
  }

  getSchedules(){
    this.service.getAllSolutions().subscribe({
      next: (schedules: Solution[])=> {
        this.schedules = schedules.reverse();
        this.dataSource.data= schedules;
        this.dataSource.paginator = this.paginator;
        console.log(this.schedules)
      },
      error: (err: HttpErrorResponse)=> {
        this.openErrorDialog(err.error)
      }
    })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message}
    })
  }

  viewSchedule(schedule: Solution){
    this.service.getDetailedSolution(schedule);
  }

  exportProblem(schedule: Solution) {
    this.service.exportProblem(schedule).subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + "_" + schedule.startDate + "_" + schedule.endDate + "_" + schedule.version + ".txt", {type:"text/plain;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  generateNewSchedule(){
    this.router.navigate(["/" + SCHEDULE_GENERATION])
  }
}
