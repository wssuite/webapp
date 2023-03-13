import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractsExample } from 'src/app/constants/contracts';
import { nurses_example, nurses_name_example } from 'src/app/constants/nurses';
import { NurseGroupInterface, NurseInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse-group-creation-dialog',
  templateUrl: './nurse-group-creation-dialog.component.html',
  styleUrls: ['./nurse-group-creation-dialog.component.css']
})
export class NurseGroupCreationDialogComponent {
  availableContracts: string[];
  selectedContract: string;
  contracts: string[]
  availableNurses: string[]
  selectedNurse: string;
  nurses: string[]

  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });


  constructor(public dialogRef: MatDialogRef<NurseGroupCreationDialogComponent >, @Inject(MAT_DIALOG_DATA) public data: NurseGroupInterface){
    this.availableContracts = contractsExample
    this.selectedContract = this.availableContracts[0]
    this.contracts = []
    this.availableNurses = nurses_name_example
    this.selectedNurse = this.availableNurses[0]
    this.nurses = []
  }

  addContract(){
    const index = this.availableContracts.indexOf(this.selectedContract);
    if (index > -1) {
      this.availableContracts.splice(index, 1);
    }
    this.contracts.push(this.selectedContract);
    if (this.availableContracts.length > 0) {
      this.selectedContract = this.availableContracts[0];
    }
  }

  removeContract(contract: string) {
    const index = this.contracts.indexOf(contract);
    if (index > -1) {
      this.contracts.splice(index, 1);
    }
    if (contract !== undefined && contract !== null) {
      this.availableContracts.push(contract);
    }
  }

  addNurse(){
    const index = this.availableNurses.indexOf(this.selectedNurse);
    if (index > -1) {
      this.availableNurses.splice(index, 1);
    }
    this.nurses.push(this.selectedNurse);
    if (this.availableNurses.length > 0) {
      this.selectedNurse = this.availableNurses[0];
    }
  }

  removeNurse(nurse: string) {
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurses.splice(index, 1);
    }
    if (nurse !== undefined && nurse !== null) {
      this.availableNurses.push(nurse);
    }
  }

  add() {
    //valide form
    //call api service to push the shift type
    this.close();
  }
  
  close(){
    this.dialogRef.close();
  
  }

}
