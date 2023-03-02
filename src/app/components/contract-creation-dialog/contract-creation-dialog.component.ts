import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { shiftsExample } from 'src/app/constants/shifts';
import { Contract } from 'src/app/models/Contract';
import { APIService } from 'src/app/services/api-service/api.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-contract-creation-dialog',
  templateUrl: './contract-creation-dialog.component.html',
  styleUrls: ['./contract-creation-dialog.component.css']
})
export class ContractCreationDialogComponent {

  contractErrorState: boolean;
  possibleShifts: string[];

  constructor(
    public dialogRef: MatDialogRef<ContractCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {contract: Contract},
    private service: ContractService, private api: APIService,
    private dialog: MatDialog,
  ){
    this.contractErrorState = true;
    this.possibleShifts = shiftsExample;
    this.service.setContract(data.contract);
  }

  submit() {
    try
    {
      this.service.setContract(this.data.contract)
      this.service.validateContract();
      //call api service to push the contract
      const contractJson = this.service.getJson();
      console.log(contractJson);
      this.api.addContract(contractJson).subscribe({
        next: data=> {
          this.dialog.open(ErrorMessageDialogComponent, {
            data: {message: data},
          })
          this.close()
        },
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.close();
          }
          else{
            this.dialog.open(ErrorMessageDialogComponent,{
              data:{message: err.error}
            })
          }
        } 
      })
    }
    catch(e){
      this.dialog.open(ErrorMessageDialogComponent, {
        data: {message: (e as Exception).getMessage()},
      })
    }
  }

  close(){
    this.dialogRef.close();
  }

  updateContractErrorState(e: boolean) {
    this.contractErrorState = e;
  }
}
