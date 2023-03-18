import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {Router } from '@angular/router';
import { IMPORT } from 'src/app/constants/app-routes';
import { BaseProfile } from 'src/app/models/Profile';
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
    private router: Router
  ){}

  createEmptyProfile(){
    const dialog = this.dialog.open(CreateEmptyProfileDialogComponent, {
      data: {profiles: this.data.profiles},
      height: '65%',
      width: '55%', 
      position: {top:'5vh',left: '25%', right: '25%'}
    })
    dialog.afterClosed().subscribe(()=>{
      this.dialogRef.close();
    })
  }

  importProfile(){
    /*const dialog = this.dialog.open(ImportProfileComponent, {
      data: {profiles: this.data.profiles},
      height: '65%',
      width: '55%', 
      position: {top:'5vh',left: '25%', right: '25%'}
    })
    dialog.afterClosed().subscribe(()=>{
      this.dialogRef.close();
    })*/
    this.dialogRef.close()
    this.router.navigate(["/" + IMPORT])
  }
}
