import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { CONSULT_SCHEDULE, CREATE_ACCOUNT, LOGIN } from 'src/app/constants/app-routes';
import { IN_PROGRESS, WAITING} from 'src/app/constants/schedule_states';
import { NOTIFICATION_UPDATE } from 'src/app/constants/socket-events';
import { BaseProfile } from 'src/app/models/Profile';
import { ContinuousVisualisationInterface, Solution } from 'src/app/models/Schedule';
import { AccountService } from 'src/app/services/account/account.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ScheduleService } from 'src/app/services/schedule/schedule-service.service';
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
export class HeaderComponent implements OnInit, AfterViewInit{
  
  isAdmin!: boolean;
  profiles: BaseProfile[];
  profile!: BaseProfile;
  username!: string;
  validProfile: boolean;
  connectedUser!: boolean;
  notifications: Solution[];
  newNotificationAdded: boolean;
  @Input() showProfile!: boolean; 
  
  constructor(private accountService: AccountService, private router: Router,
    private dialog: MatDialog, private profileService: ProfileService, 
    private scheduleService: ScheduleService){
      this.profiles = [];
      this.validProfile = false;
      this.notifications = []
      this.newNotificationAdded = false;
      this.showProfile = true;
    }

  ngOnInit(): void {
    try{
      this.getProfiles(false);
      this.isAdmin = CacheUtils.getIsAdmin();
      this.username = CacheUtils.getUsername();
      this.connectedUser= true;
    } catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
      this.profileService.newImportedProfileCreated.subscribe((created: boolean)=>{
        this.getProfiles(created);
      })
      this.scheduleService.socket.on(NOTIFICATION_UPDATE, (solution: Solution)=>{
        if(this.notifications.indexOf(solution) <= -1){
          this.notifications.push(solution);
          this.newNotificationAdded = true;
        }
        const savedNotifSub: ContinuousVisualisationInterface = {
          startDate: solution.startDate,
          endDate: solution.endDate,
          profile: solution.profile,
          version: solution.version,
        }
        if(solution.state !== IN_PROGRESS && solution.state!== WAITING && CacheUtils.isNotifSubscription(savedNotifSub)){
          CacheUtils.removeNotifSubscription(savedNotifSub)
          this.scheduleService.notificationUnsubscribe(savedNotifSub);
        }
        console.log(solution.state);
      })
  }
  
  getProfiles(useLatProfile: boolean){
    this.profileService.getAllProfiles().subscribe({
      next:(profiles: BaseProfile[])=>{
        this.profiles = profiles;
        if(this.profiles.length === 0){
          this.openCreateProfileDialog(false);
        }
        else{
          if(useLatProfile){
            this.profile = this.profiles[this.profiles.length - 1]
            CacheUtils.setProfile(this.profile.profile);
            this.validProfile = true;
            this.profileService.emitProfileChange();
          }
          else{
            try{
              const profileName = CacheUtils.getProfile();
              this.profiles.forEach((profile: BaseProfile)=>{
                if(profile.profile === profileName){
                  this.profile = profile;
                }
              })
            } catch(err){
              this.profile = this.profiles[this.profiles.length - 1]
              console.log(this.profile)
              CacheUtils.setProfile(this.profile.profile);
            } finally{
              this.validProfile = true;
              this.profileService.emitProfileChange();
            }
          }
        }
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }

  openCreateProfileDialog(closeDisplayed: boolean) {
    const dialog = this.dialog.open(CreateProfileDialogComponent,{
      data: {profiles: this.profiles, closeDisplayed: closeDisplayed},
      disableClose: true,  
      height: '64%',
      width: '55%', 
      position: {top:'10vh',left: '25%', right: '25%'},
    })
    dialog.afterClosed().subscribe(()=>{
      console.log("here")
      /*this.profileService.editionFinished.subscribe((isFinished: boolean)=>{
        console.log(isFinished)
        if(isFinished){
          console.log(isFinished)
          this.profileService.newProfileCreated.subscribe((verdict: boolean)=>{
            this.getProfiles(verdict);
          })
        }
      })*/
      if(this.profileService.editionFinished){
        this.getProfiles(this.profileService.newProfileCreated);
      }
    })
  }

  logout() {
    try{
      this.accountService.logout().subscribe({
        error: (err: HttpErrorResponse)=>{
          if(err.status === HttpStatusCode.Ok){
            this.router.navigate(["/" + LOGIN]);
            this.scheduleService.disconnectSocket();
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
      this.getProfiles(true);
    })
  }

  deleteProfile(){
    this.profileService.deleteProfile().subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status !== HttpStatusCode.Ok){
          this.openErrorDialog(err.error);
        }
        else{
          this.getProfiles(true);
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

  export() {
    this.profileService.export().subscribe({
      next: (data: {content: string})=>{
        const file = new File([data.content], CacheUtils.getProfile() + ".csv", {type:"text/csv;charset=utf-8"});
        saveAs(file);
      }
    })
  }

  updateNewNotificationState(){
    this.newNotificationAdded = false;
  }

  viewSchedule(sol: Solution){
    this.scheduleService.selectedScheduleToView = sol;
    this.router.navigate(["/"+ CONSULT_SCHEDULE])
  }
}
