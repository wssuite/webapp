import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NurseInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse-creation',
  templateUrl: './nurse-creation.component.html',
  styleUrls: ['./nurse-creation.component.css']
})
export class NurseCreationComponent implements OnInit {
  @Input() nurse!: NurseInterface;
  @Output() nurseChange: EventEmitter<NurseInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleContracts!: string[];
  @Input() possibleContractsGroup!: string[];
  @Input() selectedContract!: string;
  @Input() selectedContractGroup!: string;
  @Input() nurses!: string[]

  usernameNurseFormCtrl: FormControl;
  nameNurseFormCtrl: FormControl;
  contractSelectorError: boolean;
  contractGroupSelectorError: boolean;
  inputDisabled: boolean;
  contractsError: boolean;
  contractsGroupError: boolean;
  nurseStartUsername!: string;

  constructor(){
    this.nurseChange = new EventEmitter();
    this.errorState = new EventEmitter();
 
    this.usernameNurseFormCtrl = new FormControl(null, Validators.required);
    this.nameNurseFormCtrl = new FormControl(null, Validators.required);
    this.contractSelectorError = true;
    this.contractGroupSelectorError= true;
    this.inputDisabled = false;
    this.contractsError = true;
    this.contractsGroupError = true;
  }

  ngOnInit(): void {
    this.inputDisabled = this.nurse.name === ""? false: true;
    this.inputDisabled = this.nurse.username === ""? false: true;
    this.usernameNurseFormCtrl = new FormControl({value: this.nurse.username, disabled: this.inputDisabled},
      Validators.required);
    this.nameNurseFormCtrl = new FormControl({value: this.nurse.name, disabled: this.inputDisabled},
        Validators.required);
    this.nurseStartUsername = this.nurse.username;
    
    for(let i=0; i< this.nurse.contracts.length; i++) {
      if(!this.possibleContracts.includes(this.nurse.contracts[i])){
        this.nurse.contracts.splice(i, 1);
      }
      else{
        const index = this.possibleContracts.indexOf(this.nurse.contracts[i])
        if(index > -1){
          this.possibleContracts.splice(index, 1)
        }
      }
    }

    for(let i=0; i< this.nurse.contract_groups.length; i++) {
      if(!this.possibleContractsGroup.includes(this.nurse.contract_groups[i])){
        this.nurse.contract_groups.splice(i, 1);
      }
      else{
        const index = this.possibleContractsGroup.indexOf(this.nurse.contract_groups[i])
        if(index > -1){
          this.possibleContractsGroup.splice(index, 1)
        }
      }
    }

    this.emitNurse()
  }

  addContract() {
    const index = this.possibleContracts.indexOf(this.selectedContract);
    if (index > -1) {
      this.possibleContracts.splice(index, 1);
    }
    this.nurse.contracts.push(this.selectedContract);
    if (this.possibleContracts.length > 0) {
        this.selectedContract= this.possibleContracts[0];
    }
    this.contractSelectorError = false;
    this.emitNurse();
  }
  
  removeContract(contract: string) {
    const index = this.nurse.contracts.indexOf(contract);
    if (index > -1) {
      this.nurse.contracts.splice(index, 1);
    }
    if (contract !== undefined && contract !== null) {
      this.possibleContracts.push(contract);
    }
    if(this.nurse.contracts.length === 0){
      this.contractSelectorError = true;
    } 
    this.emitNurse()
  }

  addContractGroup() {
    const index = this.possibleContractsGroup.indexOf(this.selectedContractGroup);
    if (index > -1) {
      this.possibleContractsGroup.splice(index, 1);
    }
    this.nurse.contract_groups.push(this.selectedContractGroup);
    if (this.possibleContractsGroup.length > 0) {
        this.selectedContractGroup= this.possibleContractsGroup[0];
    }
    this.contractGroupSelectorError = false;
    this.emitNurse();
  }
  
  removeContractGroup(contractGroup: string) {
    const index = this.nurse.contract_groups.indexOf(contractGroup);
    if (index > -1) {
      this.nurse.contract_groups.splice(index, 1);
    }
    if (contractGroup !== undefined && contractGroup !== null) {
      this.possibleContractsGroup.push(contractGroup);
    }
    if(this.nurse.contract_groups.length === 0){
      this.contractGroupSelectorError = true;
    } 
    this.emitNurse()
  }


  emitNurse(){
    this.nurseChange.emit(this.nurse);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.nameNurseFormCtrl.hasError('required') ||
     this.usernameNurseFormCtrl.hasError('required') || 
     (this.usernameExist() && this.nurseStartUsername === '') 
     ||(this.nurse.contracts.length === 0  && this.nurse.contract_groups.length === 0) );
    console.log("error");
  }

  usernameExist(): boolean {
    return this.nurses.includes(this.nurse.username);
  }

}

