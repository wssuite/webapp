import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Router } from '@angular/router';
import { IMPORT } from 'src/app/constants/app-routes';
import { BaseProfile } from 'src/app/models/Profile';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CreateEmptyProfileDialogComponent } from './create-empty-profile-dialog/create-empty-profile-dialog.component';

@Component({
  selector: 'app-create-profile-dialog',
  templateUrl: './create-profile-dialog.component.html',
  styleUrls: ['./create-profile-dialog.component.css']
})
export class CreateProfileDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<CreateProfileDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data:{profiles: BaseProfile[], closeDisplayed: boolean},
    private router: Router, private service: ProfileService
  ){}


  createEmptyProfile(){
    const dialog = this.dialog.open(CreateEmptyProfileDialogComponent, {
      data: {profiles: this.data.profiles},
      height: '30%',
      width: '30%', 
      position: {top:'10vh',left: '35%', right: '35%'}
    })
    dialog.afterClosed().subscribe(()=>{
      this.service.editionFinished = true
      this.dialogRef.close()
    })
  }

  importProfile(){
    this.service.editionFinished = false;
    this.dialogRef.close()
    this.router.navigate(["/" + IMPORT])
  }
}
