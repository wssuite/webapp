import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateShiftTypeDialogComponent } from '../create-shift-type-dialog/create-shift-type-dialog.component';

@Component({
  selector: 'app-shift-type',
  templateUrl: './shift-type.component.html',
  styleUrls: ['./shift-type.component.css']
})
export class ShiftTypeComponent {
  constructor(public dialog: MatDialog) {}

  openShiftTypeDialog() {
    this.dialog.open(CreateShiftTypeDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'}
      });
  }

}
