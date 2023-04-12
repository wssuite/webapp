import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogModel } from 'src/app/models/ConfirmDialogModel';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {

  message: string;
  elementName: string;

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel){
      this.message = data.message;
      this.elementName = data.elementName;
    }

    dismiss(){
      this.dialogRef.close(false)
    }

    confirm(){
      this.dialogRef.close(true)
    }
}
