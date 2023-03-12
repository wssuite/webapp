import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CREATE_ACCOUNT, LOGIN } from 'src/app/constants/app-routes';
import { BaseProfile } from 'src/app/models/Profile';
import { APIService } from 'src/app/services/api-service/api.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { CreateProfileDialogComponent } from '../create-profile-dialog/create-profile-dialog.component';
import { DuplicateProfileComponent } from '../create-profile-dialog/duplicate-profile/duplicate-profile.component';
import { ShareProfileComponent } from '../create-profile-dialog/share-profile/share-profile.component';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  
  isAdmin!: boolean;
  profiles: BaseProfile[];
  profile!: BaseProfile;
  username!: string;
  validProfile: boolean;
  
  constructor(private apiService: APIService, private router: Router,
    private dialog: MatDialog, private profileService: ProfileService){
      this.profiles = [];
      this.validProfile = false;
    }

  ngOnInit(): void {
    try{
      this.getProfiles();
      this.isAdmin = CacheUtils.getIsAdmin();
      this.username = CacheUtils.getUsername();
    } catch(err){
      //Do nothing
    }
  }
  
  getProfiles(){
    this.apiService.getAllProfiles().subscribe({
      next:(profiles: BaseProfile[])=>{
        this.profiles = profiles;
        if(this.profiles.length === 0){
          this.openCreateProfileDialog();
        }
        else{
          this.profile = this.profiles[this.profiles.length - 1]
          console.log(this.profile)
          CacheUtils.setProfile(this.profile.profile);
          this.profileService.emitProfileChange();
          this.validProfile = true;
        }
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }

  openCreateProfileDialog() {
    const dialog = this.dialog.open(CreateProfileDialogComponent,{
      data: {profiles: this.profiles},
      disableClose: true,  
      height: '65%',
      width: '55%', 
      position: {top:'5vh',left: '25%', right: '25%'},
    })
    dialog.afterClosed().subscribe(()=>{
      this.getProfiles();
    })
  }

  logout() {
    try{
      this.apiService.logout().subscribe({
        error: (err: HttpErrorResponse)=>{
          if(err.status === HttpStatusCode.Ok){
            this.router.navigate(["/" + LOGIN]);
            CacheUtils.emptyCache();
          }
          else{
            this.openErrorDialog(err.error)
          }
        }
      })
    }catch(err){
      this.openErrorDialog((err as Error).message);
    }
  }

  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      data:{message: message},
    })    
  }

  goToCreateAccount(){
    this.router.navigate(["/"+ CREATE_ACCOUNT])
  }

  handleSelectionChange(){
    console.log(this.profile);
    CacheUtils.setProfile(this.profile.profile);
    this.profileService.emitProfileChange();
  }

  duplicate() {
    const dialog = this.dialog.open(DuplicateProfileComponent,{
      data: {profiles: this.profiles},
      disableClose: true,  
      height: '65%',
      width: '55%', 
      position: {top:'5vh',left: '25%', right: '25%'},
    })
    dialog.afterClosed().subscribe(()=>{
      this.getProfiles();
    })
  }

  deleteProfile(){
    this.apiService.deleteProfile().subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status !== HttpStatusCode.Ok){
          this.openErrorDialog(err.error);
        }
        else{
          this.getProfiles();
        }
      }
    })
  }

  share() {
    this.dialog.open(ShareProfileComponent, {
      data: {profileName: this.profile.profile},
      height: '65%',
      width: '55%', 
      position: {top:'5vh',left: '25%', right: '25%'},
    })
  }
}
