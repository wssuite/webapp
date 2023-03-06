import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftsTypeExample } from 'src/app/constants/shifts';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';


@Component({
  selector: 'app-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.css']
})
export class ShiftTypeComponent implements OnInit{
  shiftsType: ShiftTypeInterface[];
  shiftType: string[];
  panelOpenState: boolean;
  connectedUser!: boolean;

  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.shiftsType = shiftsTypeExample;
    this.panelOpenState = false;
    this.shiftType = [];

  }
  ngOnInit(): void {
    try{
      this.getShiftsType();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  getShiftsType(){
    this.apiService.getShiftTypeNames().subscribe({
      next: (shiftsType: string[])=> {
        this.shiftType = shiftsType;
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



  openShiftTypeDialog() {
    const dialog = this.dialog.open(CreateShiftTypeDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', shifts: []}
      });

      dialog.afterClosed().subscribe(()=>{
        this. getShiftsType;
      })
  }

  deleteShiftType(shiftType: ShiftTypeInterface){
    //Manque la vérification si le shift est dans un shift type ou group
    const index = this.shiftsType.indexOf(shiftType);
    if (index > -1) {
      this.shiftsType.splice(index, 1);
    }
  }

  modifyShiftType(shiftType: ShiftTypeInterface){
    const index = this.shiftsType.indexOf(shiftType);
    if (index > -1) {
      this.dialog.open(CreateShiftTypeDialogComponent,  
        { disableClose: true,  
          height: '60%',
          width: '50%', 
          position: {top:'5vh',left: '25%', right: '25%'},
          data: {shiftType}
        });

  }
}

}
