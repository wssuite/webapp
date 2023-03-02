import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { shiftsExample, shiftsTypeExample } from 'src/app/constants/shifts';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';

@Component({
  selector: 'app-create-shift-group-dialog',
  templateUrl: './create-shift-group-dialog.component.html',
  styleUrls: ['./create-shift-group-dialog.component.css']
})
export class CreateShiftGroupDialogComponent {
  shiftGroupName: string;
  availableShifts: string[];
  shifts: string[];
  selectedShift: string;
  availableShiftsType: string[];
  shiftsType: string[];
  selectedShiftType: string;
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >,) {
    this.shiftGroupName = "";
    this.availableShifts = shiftsExample
    this.selectedShift = this.availableShifts[0];
    this.shifts = [];
    this.availableShiftsType = shiftsTypeExample
    this.selectedShiftType = this.availableShifts[0];
    this.shiftsType = [];
   
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

removeShift(shift: string) {
  const index = this.shifts.indexOf(shift);
  if (index > -1) {
    this.shifts.splice(index, 1);
  }
  if (shift !== undefined && shift !== null) {
    this.availableShifts.push(shift);
  }
}

addShiftType() {
  const index = this.availableShiftsType.indexOf(this.selectedShiftType);
  if (index > -1) {
    this.availableShiftsType.splice(index, 1);
  }
  this.shiftsType.push(this.selectedShiftType);
  if (this.availableShiftsType.length > 0) {
    this.selectedShiftType = this.availableShiftsType[0];
  }
}

removeShiftType(shiftType: string) {
  const index = this.shiftsType.indexOf(shiftType);
  if (index > -1) {
    this.shiftsType.splice(index, 1);
  }
  if (shiftType !== undefined && shiftType !== null) {
    this.availableShiftsType.push(shiftType);
  }
}

add() {
  //valide form
  //call api service to push the shift group
  this.close();
}

close(){
  this.dialogRef.close();
}

}
