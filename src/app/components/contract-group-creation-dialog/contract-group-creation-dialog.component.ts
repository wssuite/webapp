import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractGroupInterface } from 'src/app/models/Contract';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-contract-group-creation-dialog',
  templateUrl: './contract-group-creation-dialog.component.html',
  styleUrls: ['./contract-group-creation-dialog.component.css']
})
export class ContractGroupCreationDialogComponent implements OnInit {
  @Output() errorState: EventEmitter<boolean>;
  contractGroupErrorState: boolean;
  initContractGroupName: string;
  possibleContracts!: string[];
  possibleNurses!: string[];
  

  constructor(public dialogRef: MatDialogRef<ContractGroupCreationDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data:  {contractGroup: ContractGroupInterface, contractGroups: string[]},
    private api: ContractGroupService,
    private contractService: ContractService,
    private dialog: MatDialog,  
) {
  this.errorState = new EventEmitter();
  this.contractGroupErrorState = true;
  this.initContractGroupName = data.contractGroup.name;
      
}
  ngOnInit(): void {
    this.possibleContracts = [];
    try{
      this.contractService.getContractNames().subscribe({
        next: (contracts: string[])=>{
          contracts.forEach((contract: string)=>{
            this.possibleContracts.push(contract);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })
    }catch(err){
      //Do nothing
    }

  }

  add() {
    try
    { 
      if(this.initContractGroupName == ""){
      this.api.addContractGroup(this.data.contractGroup).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.close();
          }
          else{
            this.openErrorDialog(err.error)
          }
        } 
      })
    }
    else {
      this.api.updateContractGroup(this.data.contractGroup).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.close();
          }          
          else{
            this.openErrorDialog(err.error)
          }
        }
      })
    } 
  }
  catch(e){
    this.openErrorDialog((e as Exception).getMessage())
  }
  }


openErrorDialog(message: string) {
  this.dialog.open(ErrorMessageDialogComponent, {
    data: {message: message},
  })
}

close(){
  this.dialogRef.close();

}

updateContractGroupErrorState(e: boolean) {
  console.log("update")
  this.contractGroupErrorState = e;
}
}