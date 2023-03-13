import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { nurses_example } from "src/app/constants/nurses";
import { Nurse, NurseInterface } from "src/app/models/Nurse";
import { NurseCreationDialogComponent } from "../nurse-creation-dialog/nurse-creation-dialog.component";

@Component({
  selector: "app-nurse-view",
  templateUrl: "./nurse-view.component.html",
  styleUrls: ["./nurse-view.component.css"],
})
export class NurseViewComponent {
  nurses: NurseInterface[]

  constructor(public dialog: MatDialog) {
    this.nurses = nurses_example
    
  }

  openNurseDialog() {
    this.dialog.open(NurseCreationDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', contracts: [], username:''},
      });
  }

  deleteNurse(nurse: NurseInterface){
    //Manque la vérification si le shift est dans un shift type ou group
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurses.splice(index, 1);
    }
  }




}
