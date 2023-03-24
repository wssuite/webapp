import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { ShiftTypeService } from 'src/app/services/shift/shift-type.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-shift-type-creation-dialog',
  templateUrl: './shift-type-creation-dialog.component.html',
  styleUrls: ['./shift-type-creation-dialog.component.css']
})
export class ShiftTypeCreationDialogComponent implements OnInit{
  @Output() errorState: EventEmitter<boolean> | undefined;
  shiftTypeErrorState: boolean;
  initShiftTypeName: string;
  possibleShifts!: string[];
  shiftsLoaded: boolean;
  

  constructor(public dialogRef: MatDialogRef<ShiftTypeCreationDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data:  {shiftType: ShiftTypeInterface, shiftsType: string[]},
    private api: ShiftTypeService, private shiftService: ShiftService,
    private dialog: MatDialog,  
) {
  this.errorState = new EventEmitter();
  this.shiftTypeErrorState = true;
  this.initShiftTypeName = data.shiftType.name;
  this.shiftsLoaded = false;
      
}
  ngOnInit(): void {
    this.possibleShifts = [];
    try{
      this.shiftService.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
          this.shiftsLoaded = true;
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })
    }catch(err){
      //Do nothing
    }

  }

  add() {
    try
    { 
      console.log(this.data.shiftType);
      if(this.initShiftTypeName == ""){
      this.api.addShiftType(this.data.shiftType).subscribe({
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
      this.api.updateShiftType(this.data.shiftType).subscribe({
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

updateShiftTypeErrorState(e: boolean) {
  console.log("update")
  this.shiftTypeErrorState = e;
}

}
