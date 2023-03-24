import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NurseInterface } from 'src/app/models/Nurse';
import { ContractGroupService } from 'src/app/services/contract/contract-group.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { NurseService } from 'src/app/services/nurse/nurse.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-nurse-creation-dialog',
  templateUrl: './nurse-creation-dialog.component.html',
  styleUrls: ['./nurse-creation-dialog.component.css']
})
export class NurseCreationDialogComponent  implements OnInit{
  @Output() errorState: EventEmitter<boolean>;
  nurseErrorState: boolean;
  initNurseUsername: string;
  possibleContracts!: string[];
  possibleContractsGroup!: string[];
  contractsLoaded: boolean;
  contractsGroupLoaded: boolean;
  

  constructor(public dialogRef: MatDialogRef<NurseCreationDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data:  {nurse: NurseInterface, nurses: string[]},
    private api: NurseService,
    private contractService: ContractService,
    private contractGroupService: ContractGroupService,
    private dialog: MatDialog,  
) {
  this.errorState = new EventEmitter();
  this.nurseErrorState = true;
  this.initNurseUsername = data.nurse.username;
  this.contractsLoaded = false;
  this.contractsGroupLoaded = true;
      
}
  ngOnInit(): void {
    this.possibleContracts = [];
    this.possibleContractsGroup = [];
    try{
      this.contractService.getContractNames().subscribe({
        next: (contracts: string[])=>{
          contracts.forEach((contract: string)=>{
            this.possibleContracts.push(contract);
          })
          this.contractsLoaded = true;
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })
    }catch(err){
      //Do nothing
    }
    try{
      this.contractGroupService.getAllContractGroupName().subscribe({
        next: (contractsGroup: string[])=>{
          contractsGroup.forEach((contractGroup: string)=>{
            this.possibleContractsGroup.push(contractGroup);
          })
          this.contractsGroupLoaded = true;
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
      console.log(this.data.nurse);
      if(this.initNurseUsername == ""){
      this.api.addNurse(this.data.nurse).subscribe({
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
      this.api.updateNurse(this.data.nurse).subscribe({
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

updateNurseErrorState(e: boolean) {
  console.log("update")
  this.nurseErrorState = e;
}

}

