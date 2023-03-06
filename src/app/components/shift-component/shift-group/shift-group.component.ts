import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftGroupExample } from 'src/app/constants/shifts';
import { ShiftGroupInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { CreateShiftGroupDialogComponent } from '../create-shift-group-dialog/create-shift-group-dialog.component';

@Component({
  selector: 'app-shift-group',
  templateUrl: './shift-group.component.html',
  styleUrls: ['./shift-group.component.css']
})
export class ShiftGroupComponent implements OnInit{
  shiftsGroup: ShiftGroupInterface[];
  shiftGroup: string[];
  panelOpenState: boolean
  connectedUser!: boolean;
  
  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.shiftsGroup = shiftGroupExample;
    this.shiftGroup = [];
    this.panelOpenState = false;
  }
  ngOnInit(): void {
    try{
      this.getShiftsGroup();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  getShiftsGroup(){
    this.apiService.getShiftTypeNames().subscribe({
      next: (shiftsGroup: string[])=> {
        this.shiftGroup = shiftsGroup;
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
  openShiftGroupDialog() {
    this.dialog.open(CreateShiftGroupDialogComponent,  
      { disableClose: true,  
        height: '80%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', shifts: [], shiftsType: ''}
      });
  }

  deleteShiftGroup(shiftGroup: ShiftGroupInterface){
    const index = this.shiftsGroup.indexOf(shiftGroup);
    if (index > -1) {
      this.shiftsGroup.splice(index, 1);
    }
  }

  modifyShiftGroup(shiftGroup: ShiftGroupInterface){
    const index = this.shiftsGroup.indexOf(shiftGroup);
    if (index > -1) {
      this.dialog.open(CreateShiftGroupDialogComponent,  
        { disableClose: true,  
          height: '60%',
          width: '50%', 
          position: {top:'5vh',left: '25%', right: '25%'},
          data: {shiftGroup}
        });

  }
}

}
