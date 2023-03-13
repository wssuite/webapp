import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractsExample } from 'src/app/constants/contracts';
import { NurseInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse-creation-dialog',
  templateUrl: './nurse-creation-dialog.component.html',
  styleUrls: ['./nurse-creation-dialog.component.css']
})
export class NurseCreationDialogComponent {
  availableContracts: string[];
  selectedContract: string;
  contracts: string[]

  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<NurseCreationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: NurseInterface){
    this.availableContracts = contractsExample
    this.selectedContract = this.availableContracts[0]
    this.contracts = []
  }

  add() {
    //valide form
    //call api service to push the shift type
    this.close();
  }
  
  close(){
    this.dialogRef.close();
  
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
  
  

}
