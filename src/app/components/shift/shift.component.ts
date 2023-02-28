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

  openDialog() {
    this.dialog.open(CreateShiftDialogComponent);
  }

}
 