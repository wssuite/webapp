import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NurseGroupInterface } from 'src/app/models/Nurse';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { NurseGroupCreationDialogComponent } from '../nurse-group-creation-dialog/nurse-group-creation-dialog.component';

@Component({
  selector: 'app-nurse-group0view',
  templateUrl: './nurse-group-view.component.html',
  styleUrls: ['./nurse-group-view.component.css']
})
export class NurseGroupViewComponent implements OnInit {
  
  nurseGroups: string[];
  connectedUser!:boolean;

  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.nurseGroups = [];
  }

  ngOnInit(): void {
    try{
      this.getNurseGroups();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  getNurseGroups(){
    this.apiService.getAllNurseGroup().subscribe({
      next: (name: string[])=> {
        this.nurseGroups = name;
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

  openNurseGroupCreationDialog(nurseGroup: NurseGroupInterface) {
    const dialog = this.dialog.open(NurseGroupCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {nurseGroup:nurseGroup,nurseGroups:this.nurseGroups},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getNurseGroups();
      })
  }


  createNewNurse(){
    const newNurseGroup = {name: '',contracts:[], nurses:[]};
    this.openNurseGroupCreationDialog(newNurseGroup); 
  }


  deleteNurseGroup(groupName: string){
    try
    { 
      //call api service to push the contract
      this.apiService.removeNurseGroup(groupName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.nurseGroups.indexOf(groupName);
            if (index > -1) {
              this.nurseGroups.splice(index, 1);
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

  modifyNurseGroup(groupName: string){
    this.apiService.getNurseGroupByName(groupName).subscribe({
      next:(nurseGroup: NurseGroupInterface) =>{
        this.openNurseGroupCreationDialog(nurseGroup);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }

}

