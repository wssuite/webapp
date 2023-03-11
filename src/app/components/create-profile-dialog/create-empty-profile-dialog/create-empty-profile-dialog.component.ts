import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseProfile } from 'src/app/models/Profile';
import { APIService } from 'src/app/services/api-service/api.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-create-empty-profile-dialog',
  templateUrl: './create-empty-profile-dialog.component.html',
  styleUrls: ['./create-empty-profile-dialog.component.css']
})
export class CreateEmptyProfileDialogComponent {

  name: string;
  nameCtrl: FormControl;

  profileNames: string[];

  constructor(public dialogRef: MatDialogRef<CreateEmptyProfileDialogComponent>, private api: APIService,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: {profiles: BaseProfile[]}){
    this.name = '';
    this.nameCtrl = new FormControl(null, Validators.required);
    this.profileNames = [];
    this.data.profiles.forEach((p:BaseProfile)=>{
      this.profileNames.push(p.profile);
    })
  }

  nameExist(): boolean{
    return this.profileNames.includes(this.name);
  }

  create(){
    //call the api method to create the profil
    this.api.createEmptyProfile(this.name).subscribe({
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
