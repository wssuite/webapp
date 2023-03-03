import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { Shift } from 'src/app/models/Shift';

@Component({
  selector: 'app-create-shift-type-dialog',
  templateUrl: './create-shift-type-dialog.component.html',
  styleUrls: ['./create-shift-type-dialog.component.css']
})
export class CreateShiftTypeDialogComponent {
  shiftTypeName: string;
  availableShifts: Shift[];
  shifts: Shift[];
  selectedShift: Shift;


  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >,) {
    this.shiftTypeName = "";
    this.availableShifts = shiftsExample
    this.selectedShift = this.availableShifts[0];
    this.shifts = [];
  
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

removeShift(shift: Shift) {
  const index = this.shifts.indexOf(shift);
  if (index > -1) {
    this.shifts.splice(index, 1);
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
