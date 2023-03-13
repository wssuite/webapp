import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftGroupInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftGroupCreationDialogComponent } from '../shift-group-creation-dialog/shift-group-creation-dialog.component';

@Component({
  selector: 'app-shifts-group-view',
  templateUrl: './shifts-group-view.component.html',
  styleUrls: ['./shifts-group-view.component.css']
})
export class ShiftGroupViewComponent implements OnInit{
  shiftsGroup: string[];
  connectedUser!: boolean;
  
  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.shiftsGroup = [];
  }
  ngOnInit(): void {
    try{
      this.getShiftsGroup();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  getShiftsGroup(){
    this.apiService.getShiftGroupNames().subscribe({
      next: (shiftsGroup: string[])=> {
        this.shiftsGroup = shiftsGroup;
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

  openShiftGroupCreationDialog(shiftGroup: ShiftGroupInterface) {
    const dialog = this.dialog.open(ShiftGroupCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {shiftGroup:shiftGroup, shiftsGroup:this.shiftsGroup}
      });

    dialog.afterClosed().subscribe(()=>{
        this.getShiftsGroup;
      })
  }

   createNewShiftGroup(){
    const newShiftGroup = {name: '', shifts: [], shiftTypes: []};
    this.openShiftGroupCreationDialog(newShiftGroup); 
  }

  deleteShiftGroup(shiftGroupName: string){
    try
    { 
      //call api service to push the contract
      this.apiService.removeShiftGroup(shiftGroupName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.shiftsGroup.indexOf(shiftGroupName);
            if (index > -1) {
              this.shiftsGroup.splice(index, 1);
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

  modifyShiftGroup(shiftGroupName: string){
    this.apiService.getShiftGroupByName(shiftGroupName).subscribe({
      next:(shiftGroup: ShiftGroupInterface) =>{
        this.openShiftGroupCreationDialog(shiftGroup);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }






}


