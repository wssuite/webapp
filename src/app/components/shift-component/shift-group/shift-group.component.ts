import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { shiftGroupExample } from 'src/app/constants/shifts';
import { ShiftGroup } from 'src/app/models/Shift';
import { CreateShiftGroupDialogComponent } from '../create-shift-group-dialog/create-shift-group-dialog.component';

@Component({
  selector: 'app-shift-group',
  templateUrl: './shift-group.component.html',
  styleUrls: ['./shift-group.component.css']
})
export class ShiftGroupComponent {
  shiftsGroup: ShiftGroup[]
  panelOpenState: boolean
  
  constructor(public dialog: MatDialog) {
    this.shiftsGroup = shiftGroupExample;
    this.panelOpenState = false;
  }

  openShiftGroupDialog() {
    this.dialog.open(CreateShiftGroupDialogComponent,  
      { disableClose: true,  
        height: '80%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', shifts: [], shiftsType: ''}
      });
  }

  deleteShiftGroup(shiftGroup: ShiftGroup){
    const index = this.shiftsGroup.indexOf(shiftGroup);
    if (index > -1) {
      this.shiftsGroup.splice(index, 1);
    }
  }

  modifyShiftGroup(shiftGroup: ShiftGroup){
    const index = this.shiftsGroup.indexOf(shiftGroup);
    if (index > -1) {
      this.dialog.open(CreateShiftGroupDialogComponent,  
        { disableClose: true,  
          height: '60%',
          width: '50%', 
          position: {top:'5vh',left: '25%', right: '25%'},
          data: {shiftGroup}
        });

  }
}

}
