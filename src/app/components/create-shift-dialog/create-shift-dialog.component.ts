import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-shift-dialog',
  templateUrl: './create-shift-dialog.component.html',
  styleUrls: ['./create-shift-dialog.component.css']
})
export class CreateShiftDialogComponent {
  shiftName: string;
  startTime: string;
  endTime: string;
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftDialogComponent >,) {
    this.shiftName = "";
    this.startTime = "";
    this.endTime = "";
    
}

submit() {
  //valide form
  //call api service to push the shift
  this.close();
}

close(){
  this.dialogRef.close();
}



}
