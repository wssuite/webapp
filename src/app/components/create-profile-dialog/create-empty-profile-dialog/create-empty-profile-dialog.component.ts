import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-empty-profile-dialog',
  templateUrl: './create-empty-profile-dialog.component.html',
  styleUrls: ['./create-empty-profile-dialog.component.css']
})
export class CreateEmptyProfileDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreateEmptyProfileDialogComponent>){}
}
