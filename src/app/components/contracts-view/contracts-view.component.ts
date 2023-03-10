import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
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
  connectedUser!:boolean;
  displayedContracts: string[];
  pageSize = 6;
  page!: PageEvent;
  indexBefore: number;

  constructor(private dialog: MatDialog, private apiService: APIService,
    private contarctService: ContractService) {
    this.contracts = [];
    this.displayedContracts = [];
    this.indexBefore = 0;
  }

  ngOnInit(): void {
    try{
      this.getContracts();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  getContracts(){
    this.apiService.getContractNames().subscribe({
      next: (contracts: string[])=> {
        this.contracts = contracts;
        this.setDisplayedContracts(this.indexBefore);
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }

  openContractCreationDialog(contract: Contract){
    this.indexBefore = this.page === undefined? 0: this.page.pageIndex;
    const dialog = this.dialog.open(ContractCreationDialogComponent,
      {data: {contract: contract, contractList: this.contracts},
   })
   dialog.afterClosed().subscribe(()=>{
    this.getContracts()
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

  handlePageEvent(e: PageEvent){
    this.page = e;
    this.setDisplayedContracts(e.pageIndex);
  }

  setDisplayedContracts(index: number){
    let startIndex = index * this.pageSize;
    this.displayedContracts = [];
    const endIndex = ((startIndex + this.pageSize) > this.contracts.length)? this.contracts.length : startIndex + this.pageSize;
    for(startIndex; startIndex < endIndex; startIndex++){
      this.displayedContracts.push(this.contracts[startIndex]);
    }
  }

  deleteContract(contract:string){
    this.apiService.deleteContract(contract).subscribe({
      error:(error: HttpErrorResponse)=>{
        if(error.status === HttpStatusCode.Ok){
          this.getContracts();
        }
        else {
          this.openErrorDialog(error.error);
        }
      }
    })
  }
}
