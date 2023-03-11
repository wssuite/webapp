import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CREATE_ACCOUNT, LOGIN } from 'src/app/constants/app-routes';
import { BaseProfile } from 'src/app/models/Profile';
import { APIService } from 'src/app/services/api-service/api.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { CreateProfileDialogComponent } from '../create-profile-dialog/create-profile-dialog.component';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  
  isAdmin!: boolean;
  profiles: BaseProfile[];
  profileSelectorFormCtrl: FormControl;
  profile!: BaseProfile;
  
  constructor(private apiService: APIService, private router: Router,
    private dialog: MatDialog){
      this.profiles = [];
      this.profileSelectorFormCtrl = new FormControl();
    }

  ngOnInit(): void {
    try{
      this.getProfiles();
      this.isAdmin = CacheUtils.getIsAdmin() 
    } catch(err){
      //Do nothing
    }
  }
  
  getProfiles(){
    this.apiService.getAllProfiles().subscribe({
      next:(profiles: BaseProfile[])=>{
        this.profiles = profiles;
        if(this.profiles.length === 0){
          const dialog = this.dialog.open(CreateProfileDialogComponent,{
            disableClose: true,  
            height: '65%',
            width: '55%', 
            position: {top:'5vh',left: '25%', right: '25%'},
          })
          dialog.afterClosed().subscribe(()=>{
            this.getProfiles();
          })
        }
        else{
          //this.profileSelectorFormCtrl.setValue(this.profiles[this.profiles.length - 1]);
          this.profile = this.profiles[this.profiles.length - 1]
        }
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
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
  }
}
