import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { Contract } from 'src/app/models/Contract';
import { ContractService } from 'src/app/services/contract/contract.service';

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
    @Inject(MAT_DIALOG_DATA) public data : {contract: Contract},
    private service: ContractService
  ){
    this.contractErrorState = true;
    this.possibleShifts = shiftsExample;
    this.service.setContract(data.contract);
  }

  submit() {
    //valide contract
    this.service.setContract(this.data.contract)
    this.service.validateContract();
    //call api service to push the contract
    this.service.submitContract();
    this.close();
  }

  close(){
    this.dialogRef.close();
  }

  updateContractErrorState(e: boolean) {
    this.contractErrorState = e;
  }
}
