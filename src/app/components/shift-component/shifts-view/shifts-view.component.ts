import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftCreationDialogComponent } from '../shift-creation-dialog/shift-creation-dialog.component';

@Component({
  selector: 'app-shifts-view',
  templateUrl: './shifts-view.component.html',
  styleUrls: ['./shifts-view.component.css']
})
export class ShiftsViewComponent implements OnInit, AfterViewInit {
  
  shifts: string[];
  connectedUser!:boolean;
  

  constructor(public dialog: MatDialog, private apiService: ShiftService, private profileService: ProfileService) {
    this.shifts = [];
  }

  ngOnInit(): void {
    try{
      this.getShifts();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
      this.profileService.profileChanged.subscribe(()=>{
        this.getShifts();
      })
  }

  getShifts(){
    this.apiService.getShiftNames().subscribe({
      next: (shift: string[])=> {
        this.shifts = shift;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }

  openShiftCreationDialog(shift: ShiftInterface) {
    const dialog = this.dialog.open(ShiftCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {shift:shift,shifts:this.shifts},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getShifts();
      })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  createNewShift(){
    const newShift = {name: '',startTime: '', endTime:'', profile: CacheUtils.getProfile()};
    this.openShiftCreationDialog(newShift); 
  }

  deleteShift(shiftName: string){
    try
    { 
      //call api service to push the contract
      this.apiService.removeShift(shiftName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.shifts.indexOf(shiftName);
            if (index > -1) {
              this.shifts.splice(index, 1);
            }
          }
          else{
            this.openErrorDialog(err.error)
          }
        } 
      })
    }
    catch(e){
      console.log("error")
      this.openErrorDialog((e as Exception).getMessage())
    }
  }

  modifyShift(shiftName: string){
    this.apiService.getShiftByName(shiftName).subscribe({
      next:(shift: ShiftInterface) =>{
        this.openShiftCreationDialog(shift);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }

}


