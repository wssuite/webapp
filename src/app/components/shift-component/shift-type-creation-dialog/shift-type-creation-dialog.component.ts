import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-shift-type-creation-dialog',
  templateUrl: './shift-type-creation-dialog.component.html',
  styleUrls: ['./shift-type-creation-dialog.component.css']
})
export class ShiftTypeCreationDialogComponent implements OnInit {
  possibleShifts: string[];
  selectedShift: string;
  shifts: string[];



  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<ShiftTypeCreationDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data: ShiftTypeInterface,
    private api: APIService,
    private dialog: MatDialog,  
) {
    this.possibleShifts = [];
    this.selectedShift = this.possibleShifts[0];
    this.shifts = [];
    this.possibleShifts = []
      
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
          this.openErrorDialog(error.error);
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


add() {
  try
  { 
    //call api service to push the contract
    
    this.api.addShiftType(this.data).subscribe({
      error: (err: HttpErrorResponse)=> {
        if(err.status === HttpStatusCode.Ok) {
          this.close();
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


openErrorDialog(message: string) {
  this.dialog.open(ErrorMessageDialogComponent, {
    data: {message: message},
  })
}

close(){
  this.dialogRef.close();

}

}
