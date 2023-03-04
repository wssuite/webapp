import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { contractsExample } from 'src/app/constants/contracts';
import { nurses_example } from 'src/app/constants/nurses';
import { NurseGroup, NurseInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-create-nurse-group-dialog',
  templateUrl: './create-nurse-group-dialog.component.html',
  styleUrls: ['./create-nurse-group-dialog.component.css']
})
export class CreateNurseGroupDialogComponent {
  availableContracts: string[];
  selectedContract: string;
  contracts: string[]
  availableNurse: NurseInterface[]
  selectedNurse: NurseInterface;
  nurses: NurseInterface[]

  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });


  constructor(public dialogRef: MatDialogRef<CreateNurseGroupDialogComponent >, @Inject(MAT_DIALOG_DATA) public data: NurseGroup){
    this.availableContracts = contractsExample
    this.selectedContract = this.availableContracts[0]
    this.contracts = []
    this.availableNurse = nurses_example
    this.selectedNurse = this.availableNurse[0]
    this.nurses = []
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
