import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ContractGroupInterface } from 'src/app/models/Contract';

@Component({
  selector: 'app-contract-group-creation',
  templateUrl: './contract-group-creation.component.html',
  styleUrls: ['./contract-group-creation.component.css']
})

export class ContractGroupCreationComponent implements OnInit {
  @Input() contractGroup!: ContractGroupInterface;
  @Output() contractGroupChange: EventEmitter<ContractGroupInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleContracts!: string[];
  @Input() selectedContract!: string;
  @Input() contractGroups!: string[]

  nameContractGroupFormCtrl: FormControl;
  contractSelectorError: boolean;
  inputDisabled: boolean;
  contractsError: boolean;
  contractGroupStartname!: string;



  constructor(){
    this.contractGroupChange = new EventEmitter();
    this.errorState = new EventEmitter();
 
    this.nameContractGroupFormCtrl = new FormControl(null, Validators.required);
    this.contractSelectorError = true;
    this.inputDisabled = false;
    this.contractsError = true;
  }

  ngOnInit(): void {
    this.inputDisabled = this.contractGroup.name === ""? false: true;
    this.nameContractGroupFormCtrl = new FormControl({value: this.contractGroup.name, disabled: this.inputDisabled},
      Validators.required);
    this.contractGroupStartname = this.contractGroup.name; 
  }

  addContract() {
    const index = this.possibleContracts.indexOf(this.selectedContract);
    if (index > -1) {
      this.possibleContracts.splice(index, 1);
    }
    this.contractGroup.contracts.push(this.selectedContract);
    if (this.possibleContracts.length > 0) {
        this.selectedContract= this.possibleContracts[0];
    }
    this.contractSelectorError = false;
    this.emitContractGroup();
  }
  
  removeContract(contract: string) {
    const index = this.contractGroup.contracts.indexOf(contract);
    if (index > -1) {
      this.contractGroup.contracts.splice(index, 1);
    }
    if (contract !== undefined && contract !== null) {
      this.possibleContracts.push(contract);
    }
    if(this.contractGroup.contracts.length === 0){
      this.contractSelectorError = true;
    } 
    this.emitContractGroup()
  }


  emitContractGroup(){
    this.contractGroupChange.emit(this.contractGroup);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.nameContractGroupFormCtrl.hasError('required') || this.nameContractGroupFormCtrl.hasError('required') || (this.nameExist() && this. contractGroupStartname === '') ||this.contractSelectorError ||this.nameContractGroupFormCtrl.hasError('required')|| this.contractSelectorError  );
    console.log("error");
  }

  nameExist(): boolean {
    return this.contractGroups.includes(this.contractGroup.name);
  }

}