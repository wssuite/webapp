import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';
import { ShiftService } from 'src/app/services/shift/shift.service';
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
  initShiftName: string;
  constructor(public dialogRef: MatDialogRef<ShiftCreationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {shift: ShiftInterface, shifts: string[]},  
    private api: ShiftService,
    private dialog: MatDialog,                                       
    ) { 
      this.errorState = new EventEmitter();
      this.shiftErrorState = true;
      this.initShiftName = data.shift.name;
}

add() {
  try
  { 
    console.log(this.data.shift);
    if(this.initShiftName === ""){
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
    height: '45%',
    width: '45%', 
    position: {top:'20vh',left: '30%', right: '25%'},
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
