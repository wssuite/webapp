import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NurseInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse-creation',
  templateUrl: './nurse-creation.component.html',
  styleUrls: ['./nurse-creation.component.css']
})
export class NurseCreationComponent implements OnInit, OnChanges {
  @Input() nurse!: NurseInterface;
  @Output() nurseChange: EventEmitter<NurseInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleContracts!: string[];
  @Input() possibleContractsGroup!: string[];
  @Input() selectedContract!: string;
  @Input() selectedContractGroup!: string;
  @Input() nurses!: string[]
  @Input() imported: boolean

  usernameNurseFormCtrl: FormControl;
  nameNurseFormCtrl: FormControl;
  contractSelectorError: boolean;
  contractGroupSelectorError: boolean;
  inputDisabled: boolean;
  contractsError: boolean;
  contractsGroupError: boolean;
  nurseStartUsername!: string;
  localContracts: string[]
  localContractGroups: string[]

  constructor(){
    this.nurseChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false
    this.usernameNurseFormCtrl = new FormControl(null, Validators.required);
    this.nameNurseFormCtrl = new FormControl(null, Validators.required);
    this.contractSelectorError = true;
    this.contractGroupSelectorError= true;
    this.inputDisabled = false;
    this.contractsError = true;
    this.contractsGroupError = true;
    this.localContracts = []
    this.localContractGroups = []
  }

  ngOnInit(): void {
    this.inputDisabled = this.nurse.name === "" || this.imported? false: true;
    this.inputDisabled = this.nurse.username === "" || this.imported? false: true;
    this.usernameNurseFormCtrl = new FormControl({value: this.nurse.username, disabled: this.inputDisabled},
      Validators.required);
    this.nameNurseFormCtrl = new FormControl({value: this.nurse.name, disabled: this.inputDisabled},
        Validators.required);
    this.nurseStartUsername = this.nurse.username;
    
    for(let i=0; i< this.nurse.contracts.length; i++) {
      if(!this.possibleContracts.includes(this.nurse.contracts[i])){
        this.nurse.contracts.splice(i, 1);
      }
    }

    for(let i=0; i< this.nurse.contract_groups.length; i++) {
      if(!this.possibleContractsGroup.includes(this.nurse.contract_groups[i])){
        this.nurse.contract_groups.splice(i, 1);
      }
    }
    this.updateLocalContracts()

    this.emitNurse()
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
      this.updateLocalContracts()
  }

  updateLocalContracts(){
    this.localContracts = [...this.possibleContracts];
    this.localContractGroups = [...this.possibleContractsGroup];
    this.nurse.contracts.forEach((c: string)=>{
      const index = this.localContracts.indexOf(c)
      if(index > -1){
        this.localContracts.splice(index, 1)
      }
    })
    this.nurse.contract_groups.forEach((cg: string)=>{
      const index = this.localContractGroups.indexOf(cg)
      if(index > -1){
        this.localContractGroups.splice(index, 1)
      }
    })
    if(this.localContracts.length > 0){
      this.selectedContract = this.localContracts[0]
    }
    if(this.localContractGroups,length > 0){
      this.selectedContractGroup = this.localContractGroups[0]
    }
  }
  addContract() {
    const index = this.localContracts.indexOf(this.selectedContract);
    if (index > -1) {
      this.localContracts.splice(index, 1);
    }
    this.nurse.contracts.push(this.selectedContract);
    if (this.localContracts.length > 0) {
        this.selectedContract= this.localContracts[0];
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
      this.localContracts.push(contract);
      this.selectedContract= this.localContracts[0];
    }
    if(this.nurse.contracts.length === 0){
      this.contractSelectorError = true;
    } 
    this.emitNurse()
  }

  addContractGroup() {
    const index = this.localContractGroups.indexOf(this.selectedContractGroup);
    if (index > -1) {
      this.localContractGroups.splice(index, 1);
    }
    this.nurse.contract_groups.push(this.selectedContractGroup);
    if (this.localContractGroups.length > 0) {
        this.selectedContractGroup= this.localContractGroups[0];
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
      this.localContractGroups.push(contractGroup);
      this.selectedContractGroup= this.localContractGroups[0];
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
    const temp = [...this.nurses]
    if(this.imported){
      const index = temp.indexOf(this.nurse.username)
      if(index > -1){
        temp.splice(index, 1)
      }
    }
    return temp.includes(this.nurse.username);
  }

  setUsername(){
    let counter = 1;
    this.nurse.username = this.nurse.name + counter.toString();
    while(this.usernameExist()){
      counter++;
      this.nurse.username = this.nurse.name + counter.toString();
    }
    this.emitNurse()
  }
}

