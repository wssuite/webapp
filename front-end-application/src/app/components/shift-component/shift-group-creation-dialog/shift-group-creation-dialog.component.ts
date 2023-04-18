import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftGroupInterface} from 'src/app/models/Shift';
import { ShiftGroupService } from 'src/app/services/shift/shift-group.service';
import { ShiftTypeService } from 'src/app/services/shift/shift-type.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';


@Component({
  selector: 'app-shift-group-creation-dialog',
  templateUrl: './shift-group-creation-dialog.component.html',
  styleUrls: ['./shift-group-creation-dialog.component.css']
})
export class ShiftGroupCreationDialogComponent implements OnInit {
  @Output() errorState: EventEmitter<boolean> | undefined;
  shiftGroupErrorState: boolean;
  initShiftGroupName: string;
  possibleShifts!: string[];
  possibleShiftsType!: string[];
  shiftsLoaded: boolean;
  shiftTypesLoaded: boolean;

  constructor(public dialogRef: MatDialogRef<ShiftGroupCreationDialogComponent >, 
    @Inject(MAT_DIALOG_DATA) public data: {shiftGroup: ShiftGroupInterface, shiftsGroup: string[]},
    private api: ShiftGroupService, private shiftService: ShiftService,
    private dialog: MatDialog, private shiftTypeService: ShiftTypeService) {
    
    this.errorState = new EventEmitter();
    this.shiftGroupErrorState = true;
    this.initShiftGroupName = data.shiftGroup.name;
    this.shiftsLoaded = false;
    this.shiftTypesLoaded = false;
}
  ngOnInit(): void {
    this.possibleShifts = [];
    this.possibleShiftsType = [];
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

        this.shiftTypeService.getShiftTypeNames().subscribe({
          next: (shiftsType: string[])=>{
            shiftsType.forEach((shiftType: string)=>{
              this.possibleShiftsType.push(shiftType);
            })
            this.shiftTypesLoaded = true;
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
      console.log(this.data.shiftGroup);
      if(this.initShiftGroupName === ""){
        this.api.addShiftGroup(this.data.shiftGroup).subscribe({
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
        this.api.updateShiftGroup(this.data.shiftGroup).subscribe({
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

updateShiftGroupErrorState(e: boolean) {
  console.log("update")
  this.shiftGroupErrorState = e;
}

}
