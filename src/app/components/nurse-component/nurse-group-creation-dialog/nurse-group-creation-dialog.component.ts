import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NurseGroupInterface} from 'src/app/models/Nurse';
import { ContractService } from 'src/app/services/contract/contract.service';
import { NurseGroupService } from 'src/app/services/nurse/nurse-group.service';
import { NurseService } from 'src/app/services/nurse/nurse.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-nurse-group-creation-dialog',
  templateUrl: './nurse-group-creation-dialog.component.html',
  styleUrls: ['./nurse-group-creation-dialog.component.css']
})
export class NurseGroupCreationDialogComponent implements OnInit {
  @Output() errorState: EventEmitter<boolean>;
  nurseGroupErrorState: boolean;
  initNurseGroupName: string;
  possibleContracts!: string[];
  possibleNurses!: string[];
  

  constructor(public dialogRef: MatDialogRef<NurseGroupCreationDialogComponent >,
    @Inject(MAT_DIALOG_DATA) public data:  {nurseGroup: NurseGroupInterface, nurseGroups: string[]},
    private api: NurseGroupService, private nurseService: NurseService,
    private contractService: ContractService,
    private dialog: MatDialog,  
) {
  this.errorState = new EventEmitter();
  this.nurseGroupErrorState = true;
  this.initNurseGroupName = data.nurseGroup.name;
      
}
  ngOnInit(): void {
    this.possibleContracts = [];
    this.possibleNurses = [];
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

    try{
      this.nurseService.getAllNurseUsername().subscribe({
        next: (nurses: string[])=>{
          nurses.forEach((nurse: string)=>{
            this.possibleNurses.push(nurse);
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
      console.log(this.data.nurseGroup);
      if(this.initNurseGroupName == ""){
      this.api.addNurseGroup(this.data.nurseGroup).subscribe({
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
      this.api.updateNurseGroup(this.data.nurseGroup).subscribe({
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

updateNurseGroupErrorState(e: boolean) {
  console.log("update")
  this.nurseGroupErrorState = e;
}
}