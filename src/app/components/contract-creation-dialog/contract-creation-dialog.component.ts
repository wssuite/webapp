import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { Contract } from 'src/app/models/Contract';

@Component({
  selector: 'app-contract-creation-dialog',
  templateUrl: './contract-creation-dialog.component.html',
  styleUrls: ['./contract-creation-dialog.component.css']
})
export class ContractCreationDialogComponent {

  contractErrorState: boolean;
  possibleShifts: string[];

  constructor(
    public dialogRef: MatDialogRef<ContractCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {contract: Contract}
  ){
    this.contractErrorState = true;
    this.possibleShifts = shiftsExample;
  }

  submit() {
    //valide contract
    //call api service to push the contract
    this.close();
  }

  close(){
    this.dialogRef.close();
  }

  updateContractErrorState(e: boolean) {
    this.contractErrorState = e;
  }
}
