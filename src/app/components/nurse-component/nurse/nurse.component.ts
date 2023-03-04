import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Nurse } from "src/app/models/Nurse";
import { CreateNurseDialogComponent } from "../create-nurse-dialog/create-nurse-dialog.component";

@Component({
  selector: "app-nurse",
  templateUrl: "./nurse.component.html",
  styleUrls: ["./nurse.component.css"],
})
export class NurseComponent {
  //availableContracts: string[]

  constructor(public dialog: MatDialog) {
    //this.availableContracts = ;


  }

  openNurseDialog() {
    this.dialog.open(CreateNurseDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
      });
  }



}
