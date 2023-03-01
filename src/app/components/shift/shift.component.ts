import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateShiftDialogComponent } from '../create-shift-dialog/create-shift-dialog.component';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
  styleUrls: ['./shift.component.css']
})
export class ShiftComponent {
  constructor(public dialog: MatDialog) {}

  openShiftDialog() {
    this.dialog.open(CreateShiftDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5%',left: '25%', right: '25%'}
      });
  }

  openGroupShiftDialog() {
    this.dialog.open(CreateShiftDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5%',left: '25%', right: '25%'}
      });
  }

  openTypeShiftDialog() {
    this.dialog.open(CreateShiftDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5%',left: '25%', right: '25%'}
      });
  
    }

}
