import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NurseInterface } from "src/app/models/Nurse";
import { APIService } from "src/app/services/api-service/api.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { Exception } from "src/app/utils/Exception";
import { ErrorMessageDialogComponent } from "../../error-message-dialog/error-message-dialog.component";
import { NurseCreationDialogComponent } from "../nurse-creation-dialog/nurse-creation-dialog.component";

@Component({
  selector: "app-nurse-view",
  templateUrl: "./nurse-view.component.html",
  styleUrls: ["./nurse-view.component.css"],
})
export class NurseViewComponent implements OnInit, AfterViewInit{
  
  nurses_username: string[];
  connectedUser!:boolean;

  constructor(public dialog: MatDialog, private apiService: APIService, private profileService: ProfileService) {
    this.nurses_username = [];


    
  }
  ngOnInit(): void {
    try{
      this.getNursesUsername();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getNursesUsername();
    })    
  }

  getNursesUsername(){
    this.apiService.getAllNurseUsername().subscribe({
      next: (username: string[])=> {
        this.nurses_username = username;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }


  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  openNurseCreationDialog(nurse: NurseInterface) {
    const dialog = this.dialog.open(NurseCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {nurse:nurse,nurses:this.nurses_username},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getNursesUsername();
      })
  }


  createNewNurse(){
    const newNnurse = {name: '',username: '', contracts:[], profile: CacheUtils.getProfile()};
    this.openNurseCreationDialog(newNnurse); 
  }


  deleteNurse(nurseUsername: string){
    try
    { 
      //call api service to push the contract
      this.apiService.removeNurse(nurseUsername).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.nurses_username.indexOf(nurseUsername);
            if (index > -1) {
              this.nurses_username.splice(index, 1);
            }
          }
          else{
            this.openErrorDialog(err.error)
          }
        } 
      })
    }
    catch(e){
      console.log("error")
      this.openErrorDialog((e as Exception).getMessage())
    }
  }

  modifyNurse(nurse_username: string){
    this.apiService.getNurseByUserName(nurse_username).subscribe({
      next:(nurse: NurseInterface) =>{
        this.openNurseCreationDialog(nurse);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }

}
