import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateShiftDialogComponent } from '../create-shift-dialog/create-shift-dialog.component';

@Component({
  selector: 'app-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.css']
})
export class ShiftTypeComponent {
  constructor(public dialog: MatDialog) {}

  openShiftDialog() {
    this.dialog.open(CreateShiftDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5%',left: '25%', right: '25%'}
      });
  }

}
