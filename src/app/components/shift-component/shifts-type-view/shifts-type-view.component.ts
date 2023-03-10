import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftsTypeExample } from 'src/app/constants/shifts';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftTypeCreationDialogComponent } from '../shift-type-creation-dialog/shift-type-creation-dialog.component';


@Component({
  selector: 'app-shifts-type-view',
  templateUrl: './shifts-type-view.component.html',
  styleUrls: ['./shifts-type-view.component.css']
})
export class ShiftsTypeViewComponent implements OnInit{
  
  shiftsType: string[];


  constructor(private dialog: MatDialog, private apiService: APIService) {
    this.shiftsType = [];

  }
  ngOnInit(): void {
    this.getShiftsType();
  }

  getShiftsType(){
    this.apiService.getShiftTypeNames().subscribe({
      next: (shiftsType: string[])=> this.shiftsType = shiftsType,
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }

  openShiftTypeCreationDialog(shift_type: ShiftTypeInterface) {
    const dialog = this.dialog.open(ShiftTypeCreationDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {shift_type}
      });

      dialog.afterClosed().subscribe(()=>{
        this. getShiftsType;
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


  deleteShiftType(shiftType_name: string){
    //Manque la vérification si le shift est dans un shift type ou group
    const index = this.shiftsType.indexOf(shiftType_name);
    if (index > -1) {
      this.shiftsType.splice(index, 1);
    }
    try
    { 
      //call api service to push the contract
      console.log(shiftType_name);
      this.apiService.removeShiftType(shiftType_name).subscribe({
        error: (err: HttpErrorResponse)=> {
            //this.openErrorDialog(err.error)
          }
      })
    }
    catch(e){
      console.log("error")
      //this.openErrorDialog((e as Exception).getMessage())
    }
  }

      

}
