import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample, shiftsTypeExample } from 'src/app/constants/shifts';
import { ShiftInterface, ShiftGroupInterface, ShiftTypeInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';

@Component({
  selector: 'app-create-shift-group-dialog',
  templateUrl: './create-shift-group-dialog.component.html',
  styleUrls: ['./create-shift-group-dialog.component.css']
})
export class CreateShiftGroupDialogComponent implements OnInit {
  selectedShift: string;
  selectedShiftType: string;
  shiftsType: string[];
  shifts: string[];
  possibleShifts: string[];
  possibleShiftsType: string[];
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftGroupDialogComponent >, 
    @Inject(MAT_DIALOG_DATA) public data: ShiftGroupInterface,
    private api: APIService,
    private dialog: MatDialog) {
    
    this.possibleShiftsType = [];
    this.selectedShiftType = this.possibleShiftsType[0];
    this.possibleShifts = [];
    this.possibleShiftsType= [];
    this.shiftsType = [];
    this.shifts = [];
    this.selectedShift = this.possibleShifts[0];
}
  ngOnInit(): void {
    try{
      this.api.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          //this.openErrorDialog(error.error);
        }
      })

        this.api.getShiftTypeNames().subscribe({
          next: (shiftsType: string[])=>{
            shiftsType.forEach((shiftType: string)=>{
              this.possibleShiftsType.push(shiftType);
            })
          },
          error: (error: HttpErrorResponse)=>{
            //this.openErrorDialog(error.error);
          }
        })
    }catch(err){
      //Do nothing
    }

  }

addShift() {
  const index = this.possibleShifts.indexOf(this.selectedShift);
  if (index > -1) {
    this.possibleShifts.splice(index, 1);
  }
  this.shifts.push(this.selectedShift);
  this.data.shifts.push(this.selectedShift);
  if (this.possibleShifts.length > 0) {
    this.selectedShift = this.possibleShifts[0];
  }
}

removeShift(shift: string) {
  const index = this.shifts.indexOf(shift);
  if (index > -1) {
    this.shifts.splice(index, 1);
  }
  if (shift !== undefined && shift !== null) {
    this.possibleShifts.push(shift);
  }
}

addShiftType() {
  const index = this.possibleShiftsType.indexOf(this.selectedShiftType);
  if (index > -1) {
    this.possibleShiftsType.splice(index, 1);
  }
  this.shiftsType.push(this.selectedShiftType);
  this.data.shifts.push(this.selectedShiftType);
  if (this.possibleShiftsType.length > 0) {
    this.selectedShiftType = this.possibleShiftsType[0];
  }
}

removeShiftType(shiftType: string) {
  const index = this.shiftsType.indexOf(shiftType);
  if (index > -1) {
    this.shiftsType.splice(index, 1);
  }
  if (shiftType !== undefined && shiftType !== null) {
    this.possibleShiftsType.push(shiftType);
  }
}


add() {
  try
  { 
    //call api service to push the contract
    console.log(this.data);
    this.api.addShiftGroup(this.data).subscribe({
      error: (err: HttpErrorResponse)=> {
        if(err.status === HttpStatusCode.Ok) {
          this.close();
        }
        else{
          //this.openErrorDialog(err.error)
        }
      } 
    })
  }
  catch(e){
    console.log("error")
    //this.openErrorDialog((e as Exception).getMessage())
  }
}

/*openErrorDialog(message: string) {
  this.dialog.open(ErrorMessageDialogComponent, {
    data: {message: message},
  })
}*/


close(){
  this.dialogRef.close();
}

}
