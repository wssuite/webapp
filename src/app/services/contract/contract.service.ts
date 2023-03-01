import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorMessageDialogComponent } from 'src/app/components/error-message-dialog/error-message-dialog.component';
import { Constraint } from 'src/app/models/Constraint';
import { Contract } from 'src/app/models/Contract';
import { Exception } from 'src/app/utils/Exception';
import { APIService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  contract: Contract| undefined;

  constructor(private api: APIService, public dialog: MatDialog) {}

  setContract(c: Contract) {
    this.contract = c;
  }

  validateContract(): void {
    // validate contract
    if(this.contract === undefined || this.contract === null){
      return;
    }
    try{
      for(let i=0; i< this.contract.constraints.length; i++){
        for(let j=i+1; j< this.contract.constraints.length; j++){
          (this.contract.constraints[j] as Constraint).validateConstraint((this.contract.constraints[i] as Constraint));
        }
      }
    } catch(e) {
      this.dialog.open(ErrorMessageDialogComponent, {
        data: {message: (e as Exception).getMessage()},
      });
    }
  }

  submitContract() {
    // call api service function to submit contract
  }

  //get shifts() {}
}
