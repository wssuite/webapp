import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { ShiftInterface, ShiftTypeInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';

@Component({
  selector: 'app-create-shift-type-dialog',
  templateUrl: './create-shift-type-dialog.component.html',
  styleUrls: ['./create-shift-type-dialog.component.css']
})
export class CreateShiftTypeDialogComponent implements OnInit {
  availableShifts: ShiftInterface[];
  selectedShift: ShiftInterface;
  shifts: ShiftInterface[];
  possibleShifts: string[];


  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data: ShiftTypeInterface,
    private api: APIService,
) {
    this.availableShifts = shiftsExample;
    this.selectedShift = this.availableShifts[0];
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
          //this.openErrorDialog(error.error);
        }
      })
    }catch(err){
      //Do nothing
    }

  }



addShift() {
  const index = this.availableShifts.indexOf(this.selectedShift);
  if (index > -1) {
    this.availableShifts.splice(index, 1);
  }
  this.shifts.push(this.selectedShift);
  if (this.availableShifts.length > 0) {
    this.selectedShift = this.availableShifts[0];
  }
}

removeShift(shift: ShiftInterface) {
  const index = this.shifts.indexOf(shift);
  if (index > -1) {
    this.shifts.splice(index, 1);
  }
  if (shift !== undefined && shift !== null) {
    this.availableShifts.push(shift);
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
          //this.openErrorDialog(err.error)
        }
      } 
    })
  }
  catch(e){
    console.log(this.data);
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
