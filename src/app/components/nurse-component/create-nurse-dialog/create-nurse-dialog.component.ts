import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-nurse-dialog',
  templateUrl: './create-nurse-dialog.component.html',
  styleUrls: ['./create-nurse-dialog.component.css']
})
export class CreateNurseDialogComponent {

  constructor(public dialogRef: MatDialogRef<CreateNurseDialogComponent >){}

  add() {
    //valide form
    //call api service to push the shift type
    this.close();
  }
  
  close(){
    this.dialogRef.close();
  
  }
  

}
