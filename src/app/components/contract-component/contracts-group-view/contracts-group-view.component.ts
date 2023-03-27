import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ContractGroupInterface } from 'src/app/models/Contract';
import { ContractGroupService } from 'src/app/services/contract/contract-group.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ContractGroupCreationDialogComponent } from '../contract-group-creation-dialog/contract-group-creation-dialog.component';

@Component({
  selector: 'app-contracts-group-view',
  templateUrl: './contracts-group-view.component.html',
  styleUrls: ['./contracts-group-view.component.css']
})
export class ContractsGroupViewComponent implements OnInit, AfterViewInit{
  contractGroups: string[];
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<ContractGroupInterface>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(public dialog: MatDialog, private contractGroupService: ContractGroupService, private profileService: ProfileService) {
    this.contractGroups = [];
    this.displayedColumns =  ['name', 'contracts','actions'];
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    try{
      this.getContractGroups();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getContractGroups();
    })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getContractGroups(){
    this.contractGroupService.getAllContractGroupName().subscribe({
      next: (contractGroup: string[])=> {
        this.contractGroups = contractGroup;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.contractGroupService.getAllContractGroup().subscribe({
      next: (contractGroups: ContractGroupInterface[])=> {
        this.dataSource.data = contractGroups;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }


  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  openContractGroupCreationDialog(contractGroup: ContractGroupInterface) {
    const dialog = this.dialog.open(ContractGroupCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {contractGroup:contractGroup,contractGroups:this.contractGroups},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getContractGroups();
      })
  }


  createNewContractGroup(){
    const newNurseGroup = {name: '',contracts:[], profile: CacheUtils.getProfile()};
    this.openContractGroupCreationDialog(newNurseGroup); 
  }


  deleteContractGroup(groupName: string){
    try
    { 
      //call api service to push the contract
      this.contractGroupService.removeContractGroup(groupName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.contractGroups.indexOf(groupName);
            if (index > -1) {
              this.contractGroups.splice(index, 1);
              this.getContractGroups();
            }
          }
          else{
            this.openErrorDialog(err.error)
          }
        } 
      })
    }
    catch(e){
      console.log("error")
      this.openErrorDialog((e as Exception).getMessage())
    }
  }

  modifyContractGroup(groupName: string){
    this.contractGroupService.getContractGroupByName(groupName).subscribe({
      next:(contractGroup: ContractGroupInterface) =>{
        this.openContractGroupCreationDialog(contractGroup);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
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
