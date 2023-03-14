/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseProfile } from 'src/app/models/Profile';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-import-profile-dialog',
  templateUrl: './import-profile-dialog.component.html',
  styleUrls: ['./import-profile-dialog.component.css']
})
export class ImportProfileDialogComponent {

  fileName: string;

  constructor(public dialogRef: MatDialogRef<ImportProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{profiles: BaseProfile[]}, private profileService: ProfileService,
    private dialog: MatDialog){
      this.fileName = '';
    }

  onFileSelected(event:any){
    const file: File = event.target.files[0];
    this.fileName = file.name;
    const formData = new FormData();
    formData.append("file", file);
    this.profileService.import(formData).subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.dialogRef.close();
        }
        else{
          this.openErrorDialog(err.error);
        }
      }
    })
  }
  
  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      data:{message: message}
    })
  }
}
