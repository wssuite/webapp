import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-profile-dialog',
  templateUrl: './import-profile-dialog.component.html',
  styleUrls: ['./import-profile-dialog.component.css']
})
export class ImportProfileDialogComponent {
  constructor(public dialogRef: MatDialogRef<ImportProfileDialogComponent>){}
}
