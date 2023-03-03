import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { Shift } from 'src/app/models/Shift';
import { CreateShiftDialogComponent } from '../create-shift-dialog/create-shift-dialog.component';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent {
  shifts: Shift[]
  panelOpenState: boolean

  constructor(public dialog: MatDialog) {
    this.shifts = shiftsExample;
    this.panelOpenState = false;
  }

  openShiftDialog() {
    this.dialog.open(CreateShiftDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'}
      });
  }

}
