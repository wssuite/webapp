import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-shift-creation-dialog',
  templateUrl: './shift-creation-dialog.component.html',
  styleUrls: ['./shift-creation-dialog.component.css']
})
export class ShiftCreationDialogComponent{

  @Output() errorState: EventEmitter<boolean>;
  shiftErrorState: boolean;
  constructor(public dialogRef: MatDialogRef<ShiftCreationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {shift: ShiftInterface},  
    private api: APIService,
    private dialog: MatDialog,                                       
    ) { 
      this.errorState = new EventEmitter();
      this.shiftErrorState = true;
}

add() {
  try
  { 
    console.log(this.data.shift);
    if(this.data.shift.name == ""){
    this.api.addShift(this.data.shift).subscribe({
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
  else {
    this.api.updateShift(this.data.shift).subscribe({
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
}
catch(e){
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

updateShiftErrorState(e: boolean) {
  console.log("update")
  this.shiftErrorState = e;
}

}
