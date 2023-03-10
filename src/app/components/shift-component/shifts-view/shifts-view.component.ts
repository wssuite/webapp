import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftCreationDialogComponent } from '../shift-creation-dialog/shift-creation-dialog.component';

@Component({
  selector: 'app-shifts-view',
  templateUrl: './shifts-view.component.html',
  styleUrls: ['./shifts-view.component.css']
})
export class ShiftsViewComponent implements OnInit {
  
  shifts: string[];

  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.shifts = [];
  }

  ngOnInit(): void {
    this.getShifts();
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
        data: {shift},
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
    const newShift = {name: '',startTime: '', endTime:''};
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


