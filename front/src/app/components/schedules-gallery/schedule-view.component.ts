import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
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
import { CONSULT_SCHEDULE, SCHEDULE_GENERATION } from 'src/app/constants/app-routes';
import { NOTIFICATION_UPDATE } from 'src/app/constants/socket-events';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
    this.displayedColumns = ["CreationDate","startDate", "endDate", "versionNumber", "state", "actions"]
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
    this.service.socket.on(NOTIFICATION_UPDATE, ()=>{
      this.getSchedules()
    })
  }

  getSchedules(){
    this.service.getAllSolutions().subscribe({
      next: (schedules: Solution[])=> {
        this.schedules = schedules.reverse();
        this.dataSource.data= schedules;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: HttpErrorResponse)=> {
        this.openErrorDialog(err.error)
      }
    })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%',
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message}
    })
  }

  viewSchedule(schedule: Solution){
    this.service.selectedScheduleToView = schedule;
    this.router.navigate(["/"+ CONSULT_SCHEDULE])
  }

  exportProblem(schedule: Solution) {
    this.service.exportProblemSchedule(schedule, "txt").subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + "_" + schedule.startDate + "_" + schedule.endDate + "_" + schedule.version + ".txt", {type:"text/plain;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  removeSolution(sol: Solution){
    try{
      const dialog = this.dialog.open(ConfirmationDialogComponent,
        { disableClose: true,
          height: '50%',
          width: '28%',
          position: {top:'20vh',left: '38%', right: '25%'},
          data: {message: "contract", elementName:sol.startDate+ "-" + sol.endDate + "-" + sol.version}
        });
      dialog.afterClosed().subscribe((result: boolean)=>{
        if(result){
          this.service.removeSolution(sol).subscribe({
            error: (err: HttpErrorResponse)=>{
              if(err.status === HttpStatusCode.Ok){
                this.getSchedules()
              }
              else{
                this.openErrorDialog(err.error)
              }
            }
          })
        }
      })
    } catch(err){
      // Do nothing
    }
  }

  generateNewSchedule(){
    this.router.navigate(["/" + SCHEDULE_GENERATION])
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
