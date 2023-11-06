import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { IN_PROGRESS, WAITING } from "src/app/constants/schedule_states";
import { ContinuousVisualisationInterface } from "src/app/models/Schedule";
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-schedule-view',
  templateUrl: './schedule-view.component.html',
  styleUrls: ['./schedule-view.component.css']
})
export class SchedulesGalleryComponent implements OnInit, OnDestroy, AfterViewInit{
  connectedUser: boolean;
  schedules: Solution[];
  displayedColumns: string[];
  dataSource: MatTableDataSource<Solution>;
  alived: boolean;
  fileName: string;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: ScheduleService,
     private dialog: MatDialog, private profileService: ProfileService,
     private router: Router){
    this.connectedUser = false;
    this.schedules = []
    this.displayedColumns = ["CreationDate","startDate", "endDate", "versionNumber", "state", "actions"]
    this.dataSource = new MatTableDataSource();
    this.alived = true;
    this.fileName = ''
  }

  ngOnInit(): void {
    try{
      this.getSchedules();
      this.connectedUser = true;
    } catch(err) {
      this.connectedUser = false;
    }
  }

  ngOnDestroy(): void {
    this.alived = false;
  }

  ngAfterViewInit(): void {
    const profS = this.profileService.profileChanged.subscribe(()=>{
      if(this.alived) {
        this.getSchedules();
      } else {
        profS.unsubscribe();
      }
    })
    this.setPaginator()
  }

  setPaginator() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    } else {
      setTimeout(() => {
        this.dataSource.paginator = this.paginator
      });
    }
  }

  getSchedules(){
    this.service.getAllSolutions().subscribe({
      next: (schedules: Solution[])=> {
        this.schedules = schedules.reverse();
        this.dataSource.data= schedules;
        this.setPaginator()
        for(const sol of schedules) {
          const subscription: ContinuousVisualisationInterface = {
            startDate: sol.startDate,
            endDate: sol.endDate,
            profile: sol.profile,
            version: sol.version
          }
          if(sol.state === WAITING || sol.state === IN_PROGRESS) {
            this.service.notificationSubscribe(sol);
          } else {
            this.service.notificationUnsubscribe(sol);
          }
        }
      },
      error: (err: HttpErrorResponse)=> {
        this.openErrorDialog(err.error)
      }
    })
    this.service.socket.once(NOTIFICATION_UPDATE, (data: any)=>{
      if(this.alived) {
        this.getSchedules();
      }
    });
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%',
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message}
    })
  }

  viewSchedule(schedule: Solution, imported: boolean = false){
    this.service.selectedScheduleToView = schedule;
    this.service.importedScheduleToView = imported;
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

  onFileSelected(event:any){
    const file: File = event.target.files[0];
    this.fileName = file.name;
    this.service.importSolution(file).subscribe({
      next: (sol: Solution)=> {
        this.viewSchedule(sol, true)
      },
      error: (err: HttpErrorResponse)=>{
        if(err.status !== HttpStatusCode.Ok){
          this.openErrorDialog(err.error);
        }
      }
    })
  }
}
