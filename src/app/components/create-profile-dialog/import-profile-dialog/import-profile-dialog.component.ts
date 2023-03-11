import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseProfile } from 'src/app/models/Profile';

@Component({
  selector: 'app-import-profile-dialog',
  templateUrl: './import-profile-dialog.component.html',
  styleUrls: ['./import-profile-dialog.component.css']
})
export class ImportProfileDialogComponent {
  constructor(public dialogRef: MatDialogRef<ImportProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{profiles: BaseProfile[]}){}
}
