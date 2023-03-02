import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateShiftDialogComponent } from '../create-shift-dialog/create-shift-dialog.component';
import { CreateShiftGroupDialogComponent } from '../create-shift-group-dialog/create-shift-group-dialog.component';

@Component({
  selector: 'app-shift-group',
  templateUrl: './shift-group.component.html',
  styleUrls: ['./shift-group.component.css']
})
export class ShiftGroupComponent {
  constructor(public dialog: MatDialog) {}

  openShiftGroupDialog() {
    this.dialog.open(CreateShiftGroupDialogComponent,  
      { disableClose: true,  
        height: '80%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'}
      });
  }

}
