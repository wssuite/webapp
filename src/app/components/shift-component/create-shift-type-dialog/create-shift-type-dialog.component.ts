import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-shift-type-dialog',
  templateUrl: './create-shift-type-dialog.component.html',
  styleUrls: ['./create-shift-type-dialog.component.css']
})
export class CreateShiftTypeDialogComponent {
  shiftTypeName: string;
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >,) {
    this.shiftTypeName = "";
   
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
