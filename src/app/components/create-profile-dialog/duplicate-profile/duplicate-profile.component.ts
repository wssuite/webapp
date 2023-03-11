import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { APIService } from 'src/app/services/api-service/api.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-duplicate-profile',
  templateUrl: './duplicate-profile.component.html',
  styleUrls: ['./duplicate-profile.component.css']
})
export class DuplicateProfileComponent {

  name: string;
  nameCtrl: FormControl;

  constructor(public dialogRef: MatDialogRef<DuplicateProfileComponent>, private api: APIService,
    private dialog: MatDialog){
    this.name = '';
    this.nameCtrl = new FormControl(null, Validators.required);
  }
  
  nameExist(): boolean{
    return false;
  }

  create(){
    //call the api method to create the profil
    this.api.duplicateProfile(this.name).subscribe({
      error:(err:HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.dialogRef.close();
        }
        else{
          this.dialog.open(ErrorMessageDialogComponent, {
            data:{message: err.error},
          })
        }
      }
    })
  }

  hasError():boolean{
    return this.nameCtrl.hasError('required') || this.nameExist();
  }
}
