import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { Shift, ShiftGroup, ShiftType } from 'src/app/models/Shift';

@Component({
  selector: 'app-create-shift-type-dialog',
  templateUrl: './create-shift-type-dialog.component.html',
  styleUrls: ['./create-shift-type-dialog.component.css']
})
export class CreateShiftTypeDialogComponent {
  availableShifts: Shift[];
  selectedShift: Shift;


  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >,@Inject(MAT_DIALOG_DATA) public data: ShiftType) {
    this.availableShifts = shiftsExample
    this.selectedShift = this.availableShifts[0];
  
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

add() {
  //valide form
  //call api service to push the shift type
  this.close();
}

close(){
  this.dialogRef.close();
}

}
