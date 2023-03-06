import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { ShiftInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { CreateShiftDialogComponent } from '../create-shift-dialog/create-shift-dialog.component';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent implements OnInit {
  panelOpenState: boolean;
  shifts: string[];
  connectedUser!: boolean;

  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.panelOpenState = false;
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

  getShifts(){
    this.apiService.getShiftNames().subscribe({
      next: (shift: string[])=> {
        this.shifts = shift;
      },
      error: (error: HttpErrorResponse)=> {
        //this.openErrorDialog(error.error);
      }
    })
  }

  /*openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }*/

  openShiftDialog() {
    const dialog = this.dialog.open(CreateShiftDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', startTime: '', endTime: ''}
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getShifts();
      })
  }

  deleteShift(shift: string){
    //Manque la vérification si le shift est dans un shift type ou group
    const index = this.shifts.indexOf(shift);
    if (index > -1) {
      this.shifts.splice(index, 1);
    }
  }

  /*modifyShift(shift: string){
    const index = this.shifts.indexOf(shift);
    if (index > -1) {
      this.dialog.open(CreateShiftDialogComponent,  
        { disableClose: true,  
          height: '60%',
          width: '50%', 
          position: {top:'5vh',left: '25%', right: '25%'},
          data: {shift}
        });

  }*/
}


