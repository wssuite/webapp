import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Contract } from 'src/app/models/Contract';
import { APIService } from 'src/app/services/api-service/api.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ContractCreationDialogComponent } from '../contract-creation-dialog/contract-creation-dialog.component';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-contracts-view',
  templateUrl: './contracts-view.component.html',
  styleUrls: ['./contracts-view.component.css']
})
export class ContractsViewComponent implements OnInit, AfterViewInit{

  contracts: string[];
  connectedUser!:boolean;
  displayedContracts: string[];
  pageSize = 6;

  constructor(private dialog: MatDialog, private apiService: APIService, private profileService: ProfileService) {
    this.contracts = [];
    this.displayedContracts = [];
  }

  ngOnInit(): void {
    try{
      this.getContracts();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
      this.profileService.profileChanged.subscribe(()=>{
        this.getContracts();
      })
  }
  
  getContracts(){
    this.apiService.getContractNames().subscribe({
      next: (contracts: string[])=> {
        this.contracts = contracts;
        this.setDisplayedContracts(0);
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }

  openContractCreationDialog(contract: Contract){
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

  handlePageEvent(e: PageEvent){
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
}
