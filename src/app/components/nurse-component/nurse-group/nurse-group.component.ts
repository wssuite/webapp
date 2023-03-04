import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateNurseGroupDialogComponent } from '../create-nurse-group-dialog/create-nurse-group-dialog.component';

@Component({
  selector: 'app-nurse-group',
  templateUrl: './nurse-group.component.html',
  styleUrls: ['./nurse-group.component.css']
})
export class NurseGroupComponent {

   constructor(public dialog: MatDialog) {
  }

  openNurseGroupDialog() {
    this.dialog.open(CreateNurseGroupDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
      });
  }

}
