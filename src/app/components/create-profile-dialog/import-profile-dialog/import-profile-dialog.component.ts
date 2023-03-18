/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MAIN_MENU } from 'src/app/constants/app-routes';
import { BaseProfile, DetailedProfile } from 'src/app/models/Profile';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-import-profile-dialog',
  templateUrl: './import-profile-dialog.component.html',
  styleUrls: ['./import-profile-dialog.component.css']
})
export class ImportProfileComponent implements OnInit{

  fileName: string;
  profile!: DetailedProfile;
  validProfile: boolean;
  profileNames: string[]
  connectedUser: boolean;

  constructor( private profileService: ProfileService,
    private dialog: MatDialog, private router: Router){
      this.fileName = '';
      this.validProfile = false;
      this.profileNames = [];
      this.connectedUser = false;
    }

  ngOnInit(): void {
    try{
      this.profileService.getAllProfiles().subscribe({
        next: (profiles: BaseProfile[])=>{
          profiles.forEach((p: BaseProfile)=>{
            this.profileNames.push(p.profile)
          })
        },
        error: (err: HttpErrorResponse)=>{
          this.openErrorDialog(err.error)
        }
      })
      this.connectedUser = true;
    } catch(err){
      this.connectedUser = false;
    }
  }

  onFileSelected(event:any){
    console.log("here")
    const file: File = event.target.files[0];
    this.fileName = file.name;
    const formData = new FormData();
    formData.append("file", file);
    this.profileService.import(formData).subscribe({
      next: (data: DetailedProfile)=> {
        this.profile = data
        this.validProfile = true;
        console.log(this.profile)
      },
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.router.navigate(["/" + MAIN_MENU])
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
