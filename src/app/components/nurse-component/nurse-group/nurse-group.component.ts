import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { nursesGroup_example } from 'src/app/constants/nurses';
import { NurseGroup } from 'src/app/models/Nurse';
import { CreateNurseGroupDialogComponent } from '../create-nurse-group-dialog/create-nurse-group-dialog.component';

@Component({
  selector: 'app-nurse-group',
  templateUrl: './nurse-group.component.html',
  styleUrls: ['./nurse-group.component.css']
})
export class NurseGroupComponent {
  nursesGroup: NurseGroup[]

   constructor(public dialog: MatDialog) {
    this.nursesGroup = nursesGroup_example
  }

  openNurseGroupDialog() {
    this.dialog.open(CreateNurseGroupDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', contracts: [], nurses: []}
      });
  }

  deleteNurseGroup(nurse: NurseGroup){
    //Manque la vérification si le shift est dans un shift type ou group
    const index = this.nursesGroup.indexOf(nurse);
    if (index > -1) {
      this.nursesGroup.splice(index, 1);
    }
  }

}
