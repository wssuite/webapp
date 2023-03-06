import { Component, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';

@Component({
  selector: 'app-create-shift-dialog',
  templateUrl: './create-shift-dialog.component.html',
  styleUrls: ['./create-shift-dialog.component.css']
})
export class CreateShiftDialogComponent {
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });
  constructor(public dialogRef: MatDialogRef<CreateShiftDialogComponent >, @Inject(MAT_DIALOG_DATA) public data: ShiftInterface) { 
}

add() {
  //valide form
  //call api service to push the shift
  this.close();
}

close(){
  this.dialogRef.close();
}



}
