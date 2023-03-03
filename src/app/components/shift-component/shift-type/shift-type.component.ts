import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftsTypeExample } from 'src/app/constants/shifts';
import { ShiftType } from 'src/app/models/Shift';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';


@Component({
  selector: 'app-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.css']
})
export class ShiftTypeComponent {
  shiftsType: ShiftType[]
  panelOpenState: boolean

  constructor(public dialog: MatDialog) {
    this.shiftsType = shiftsTypeExample;
    this.panelOpenState = false;

  }

  openShiftTypeDialog() {
    this.dialog.open(CreateShiftTypeDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'}
      });
  }

  deleteShiftType(shiftType: ShiftType){
    //Manque la vérification si le shift est dans un shift type ou group
    const index = this.shiftsType.indexOf(shiftType);
    if (index > -1) {
      this.shiftsType.splice(index, 1);
    }
  }

}
