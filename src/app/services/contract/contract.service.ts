import { Injectable } from '@angular/core';
import { Constraint } from 'src/app/models/Constraint';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { ProfileService } from '../profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  contract: Contract;

  constructor(private profileService: ProfileService) {
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

  getJson(): ContractInterface{
    return this.contract.toJson(CacheUtils.getProfile());
  }
}
