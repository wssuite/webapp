import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample, shiftsTypeExample } from 'src/app/constants/shifts';
import { Shift, ShiftGroup, ShiftType } from 'src/app/models/Shift';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';

@Component({
  selector: 'app-create-shift-group-dialog',
  templateUrl: './create-shift-group-dialog.component.html',
  styleUrls: ['./create-shift-group-dialog.component.css']
})
export class CreateShiftGroupDialogComponent {
  availableShifts: Shift[];
  selectedShift: Shift;
  availableShiftsType: ShiftType[];
  selectedShiftType: ShiftType;
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >, @Inject(MAT_DIALOG_DATA) public data: ShiftGroup) {
    this.availableShifts = shiftsExample
    this.selectedShift = this.availableShifts[0];
    this.availableShiftsType = shiftsTypeExample
    this.selectedShiftType = this.availableShiftsType[0];

   
}

addShift() {
  const index = this.availableShifts.indexOf(this.selectedShift);
  if (index > -1) {
    this.availableShifts.splice(index, 1);
  }
  this.data.shifts.push(this.selectedShift);
  if (this.availableShifts.length > 0) {
    this.selectedShift = this.availableShifts[0];
  }
}

removeShift(shift: Shift) {
  const index = this.data.shifts.indexOf(shift);
  if (index > -1) {
    this.data.shifts.splice(index, 1);
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
  this.data.shiftsType.push(this.selectedShiftType);
  if (this.availableShiftsType.length > 0) {
    this.selectedShiftType = this.availableShiftsType[0];
  }
}

removeShiftType(shiftType: ShiftType) {
  const index = this.data.shiftsType.indexOf(shiftType);
  if (index > -1) {
    this.data.shiftsType.splice(index, 1);
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
