import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Constraint } from 'src/app/models/Constraint';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { APIService } from '../api-service/api.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  contract: Contract;

  constructor(private api: APIService, public dialog: MatDialog) {
    this.contract = new Contract();
  }

  setContract(c: Contract) {
    this.contract = c;
  }

  validateContract(): void {
    // validate contract
    for(let i=0; i< this.contract.constraints.length; i++){
      for(let j=i+1; j< this.contract.constraints.length; j++){
        (this.contract.constraints[j] as Constraint).validateConstraint((this.contract.constraints[i] as Constraint));
      }
    }
  }

  submitContract() {
    // call api service function to submit contract
  }

  //get shifts() {}

  getJson(): ContractInterface{
    return this.contract.toJson()
  }
}
