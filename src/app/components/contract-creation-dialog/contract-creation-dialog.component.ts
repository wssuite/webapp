import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
export class ContractCreationDialogComponent implements OnInit{

  contractErrorState: boolean;
  possibleShifts!: string[];

  possibleSkills = ["Nurse", "HeadNurse", "Physiatre"];
  initName: string;

  constructor(
    public dialogRef: MatDialogRef<ContractCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {contract: Contract, contractList: string[]},
    private service: ContractService, private api: APIService,
    private dialog: MatDialog,
  ){
    this.contractErrorState = true;
    this.service.setContract(data.contract);
    //this.contractCopy = data.contract;
    this.initName = data.contract.name;
  }
  ngOnInit(): void {
    this.possibleShifts = [];
    try{
      this.api.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.api.getShiftTypeNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.api.getShiftGroupNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.api.getAllSkills().subscribe({
        next:(skills: string[])=>{
          skills.forEach((skill: string)=>{
            this.possibleSkills.push(skill);
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

  submit() {
    try
    {
      this.service.setContract(this.data.contract)
      this.service.validateContract();
      //call api service to push the contract
      const contractJson = this.service.getJson();
      console.log(contractJson);
      if(this.initName == ""){
        this.api.addContract(contractJson).subscribe({
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
        this.api.updateContract(contractJson).subscribe({
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

  updateContractErrorState(e: boolean) {
    this.contractErrorState = e;
  }
}
