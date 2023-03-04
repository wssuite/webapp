import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { APIService } from 'src/app/services/api-service/api.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ContractCreationDialogComponent } from '../contract-creation-dialog/contract-creation-dialog.component';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-contracts-view',
  templateUrl: './contracts-view.component.html',
  styleUrls: ['./contracts-view.component.css']
})
export class ContractsViewComponent implements OnInit{

  contracts: string[];

  constructor(private dialog: MatDialog, private apiService: APIService,
    private contarctService: ContractService) {
    this.contracts = [];
  }

  ngOnInit(): void {
      this.getContracts();
  }

  getContracts(){
    this.apiService.getContractNames().subscribe({
      next: (contracts: string[])=> this.contracts = contracts,
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }
  openContractCreationDialog(contract: Contract){
    this.dialog.open(ContractCreationDialogComponent,
      {data: {contract: contract},
   })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  createNewContract() {
    const newContract = new Contract();
    this.openContractCreationDialog(newContract);
  }

  modifyContract(name: string) {
    this.apiService.getContractByName(name).subscribe({
      next:(contractJson: ContractInterface) =>{
        const contract: Contract = this.contarctService.fromJson(contractJson);
        this.openContractCreationDialog(contract);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }
}
