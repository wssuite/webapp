import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftTypeCreationDialogComponent } from '../shift-type-creation-dialog/shift-type-creation-dialog.component';


@Component({
  selector: 'app-shifts-type-view',
  templateUrl: './shifts-type-view.component.html',
  styleUrls: ['./shifts-type-view.component.css']
})
export class ShiftsTypeViewComponent implements OnInit{
  
  shiftsType: string[];
  connectedUser!:boolean;


  constructor(private dialog: MatDialog, private apiService: APIService) {
    this.shiftsType = [];

  }
  ngOnInit(): void {
    try{
      this.getShiftsType();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  getShiftsType(){
    this.apiService.getShiftTypeNames().subscribe({
      next: (shiftsType: string[])=> {
      this.shiftsType = shiftsType;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }

  openShiftTypeCreationDialog(shiftType: ShiftTypeInterface) {
    const dialog = this.dialog.open(ShiftTypeCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {shiftType:shiftType, shiftsType:this.shiftsType}
      });

      dialog.afterClosed().subscribe(()=>{
        this.getShiftsType();
      })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  createNewShiftType(){
    const newShiftType = {name: '', shifts: []};
    this.openShiftTypeCreationDialog(newShiftType); 
  }

  deleteShiftType(shiftTypeName: string){
    try
    { 
      //call api service to push the contract
      this.apiService.removeShiftType(shiftTypeName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.shiftsType.indexOf(shiftTypeName);
            if (index > -1) {
              this.shiftsType.splice(index, 1);
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

  modifyShiftType(shiftTypeName: string){
    this.apiService.getShiftTypeByName(shiftTypeName).subscribe({
      next:(shiftType: ShiftTypeInterface) =>{
        this.openShiftTypeCreationDialog(shiftType);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }


      

}
