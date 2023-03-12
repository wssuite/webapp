import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftGroupCreationDialogComponent } from '../shift-group-creation-dialog/shift-group-creation-dialog.component';

@Component({
  selector: 'app-shifts-group-view',
  templateUrl: './shifts-group-view.component.html',
  styleUrls: ['./shift-group-view.component.css']
})
export class ShiftGroupViewComponent implements OnInit{
  shiftsGroup: string[];
  panelOpenState: boolean
  connectedUser!: boolean;
  
  constructor(public dialog: MatDialog, private apiService: APIService) {
    this.shiftsGroup = [];
    this.panelOpenState = false;
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
  openShiftGroupDialog() {
    const dialog = this.dialog.open(ShiftGroupCreationDialogComponent,  
      { disableClose: true,  
        height: '80%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', shifts: [], shiftsType: ''}
      });

    dialog.afterClosed().subscribe(()=>{
        this.getShiftsGroup;
      })
  }

  deleteShiftGroup(shiftGroup_name: string){
    const index = this.shiftsGroup.indexOf(shiftGroup_name);
    if (index > -1) {
      this.shiftsGroup.splice(index, 1);
    }

    try
    { 
      //call api service to push the contract
      console.log(shiftGroup_name);
      this.apiService.removeShiftGroup(shiftGroup_name).subscribe({
        error: (err: HttpErrorResponse)=> {
            this.openErrorDialog(err.error)
          }
        })
      }
      catch(e){
      console.log("error")
      this.openErrorDialog((e as Exception).getMessage())
      }
  }


 /* modifyShiftGroup(shiftGroup: string){
    let shiftGroup;
    this.apiService.getShiftGroup(shiftGroup).subscribe({
      next: (shiftsGroup: string)=> {
        shiftsGroup = shiftsGroup;
      },
      error: (error: HttpErrorResponse)=> {
        //this.openErrorDialog(error.error);
      }
    })

    const dialog = this.dialog.open(CreateShiftGroupDialogComponent,  
      { disableClose: true,  
        height: '80%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: 'shiftGroup.name', shifts: [], shiftsType: ''}
      });

    dialog.afterClosed().subscribe(()=>{
        this.apiService.mod
      })

  }*/
}


