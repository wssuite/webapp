import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, } from '@angular/material/paginator';
import { Contract, ContractInterface } from 'src/app/models/Contract';
//import { APIService } from 'src/app/services/api-service/api.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ContractCreationDialogComponent } from '../contract-creation-dialog/contract-creation-dialog.component';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-contracts-view',
  templateUrl: './contracts-view.component.html',
  styleUrls: ['./contracts-view.component.css']
})
export class ContractsViewComponent implements OnInit, AfterViewInit{

  contracts: string[];
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<ContractInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private contractService: ContractService, private profileService: ProfileService,
    private contarctService: ContractService) {
    this.contracts = [];
    this.dataSource = new MatTableDataSource();
    this.displayedColumns =  ['name','actions'];
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  getContracts(){
    this.contractService.getContractNames().subscribe({
      next: (contracts: string[])=> {
        this.contracts = contracts;
  
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.contractService.getContracts().subscribe({
      next: (contracts: ContractInterface[])=> {
        this.dataSource.data = contracts;
  
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

  modifyContract(name: string) {
    this.contractService.getContractByName(name).subscribe({
      next:(contractJson: ContractInterface) =>{
        const contract: Contract = this.contarctService.fromJson(contractJson);
        this.openContractCreationDialog(contract);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }


  deleteContract(contract:string){
    this.contractService.deleteContract(contract).subscribe({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
