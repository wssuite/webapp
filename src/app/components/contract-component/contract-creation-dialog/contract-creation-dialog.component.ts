import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contract } from 'src/app/models/Contract';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ShiftGroupService } from 'src/app/services/shift/shift-group.service';
import { ShiftTypeService } from 'src/app/services/shift/shift-type.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { SkillService } from 'src/app/services/shift/skill.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-contract-creation-dialog',
  templateUrl: './contract-creation-dialog.component.html',
  styleUrls: ['./contract-creation-dialog.component.css']
})
export class ContractCreationDialogComponent implements OnInit{

  contractErrorState: boolean;
  possibleShifts!: string[];
  shiftsLoaded: boolean;
  shiftTypesLoaded: boolean;
  shiftGroupsLoaded: boolean;
  skillsLoaded: boolean;

  possibleSkills: string[] = [];
  initName: string;

  constructor(
    public dialogRef: MatDialogRef<ContractCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {contract: Contract, contractList: string[]},
    private service: ContractService, private shiftGroupService: ShiftGroupService,
    private dialog: MatDialog, private shiftService: ShiftService,
    private shiftTypeService: ShiftTypeService, private skillService: SkillService
  ){
    this.contractErrorState = true;
    this.service.setContract(data.contract);
    this.shiftsLoaded = false;
    this.shiftTypesLoaded = false;
    this.shiftGroupsLoaded = false;
    this.skillsLoaded = false;
    this.initName = data.contract.name;
  }
  ngOnInit(): void {
    this.possibleShifts = [];
    try{
      this.shiftService.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
          this.shiftsLoaded = true;
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.shiftTypeService.getShiftTypeNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
          this.shiftTypesLoaded = true;
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.shiftGroupService.getShiftGroupNames().subscribe({
        next: (shifts: string[])=>{
          shifts.forEach((shift: string)=>{
            this.possibleShifts.push(shift);
          })
          this.shiftGroupsLoaded = true;
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

      this.skillService.getAllSkills().subscribe({
        next:(skills: string[])=>{
          skills.forEach((skill: string)=>{
            this.possibleSkills.push(skill);
          })
          this.skillsLoaded = true
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
        this.service.addContract(contractJson).subscribe({
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
        this.service.updateContract(contractJson).subscribe({
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
