import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';

@Component({
  selector: 'app-create-shift-group-dialog',
  templateUrl: './create-shift-group-dialog.component.html',
  styleUrls: ['./create-shift-group-dialog.component.css']
})
export class CreateShiftGroupDialogComponent {
  shiftGroupName: string;
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<CreateShiftTypeDialogComponent >,) {
    this.shiftGroupName = "";
   
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
