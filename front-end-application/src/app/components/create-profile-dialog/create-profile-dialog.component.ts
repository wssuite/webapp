import { Component, HostListener, Inject } from '@angular/core';
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
    private router: Router
  ){}

  height: string = '31%';
  width: string = '30%';
  left: string = '36%';
  top: string = '30vh';

  onResize() {
    if (window.innerWidth <= 1200) {
      this.height = '50%';
      this.width = '50%';
      this.left = '28%';
      this.top = '20vh';
    } else {
      this.height = '31%';
      this.width = '30%';
      this.left = '36%';
      this.top = '30vh';
    }
  }


  createEmptyProfile(){
    this.onResize();
    const dialog = this.dialog.open(CreateEmptyProfileDialogComponent, {
      data: {profiles: this.data.profiles},
      height: this.height,
      width: this.width, 
      position: {top: this.top,left: this.left, right: '35%'}
    })
    dialog.afterClosed().subscribe(()=>{
      this.dialogRef.close()
    })
  }

  importProfile(){
    this.dialogRef.close()
    this.router.navigate(["/" + IMPORT])
  }
}
