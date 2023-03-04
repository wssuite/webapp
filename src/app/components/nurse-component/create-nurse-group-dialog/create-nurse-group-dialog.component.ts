import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-nurse-group-dialog',
  templateUrl: './create-nurse-group-dialog.component.html',
  styleUrls: ['./create-nurse-group-dialog.component.css']
})
export class CreateNurseGroupDialogComponent {

  constructor(public dialogRef: MatDialogRef<CreateNurseGroupDialogComponent >){}

  add() {
    //valide form
    //call api service to push the shift type
    this.close();
  }
  
  close(){
    this.dialogRef.close();
  
  }

}
