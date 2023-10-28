import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NurseGroupInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse-group-creation',
  templateUrl: './nurse-group-creation.component.html',
  styleUrls: ['./nurse-group-creation.component.css']
})
export class NurseGroupCreationComponent implements OnInit, OnChanges {
  @Input() nurseGroup!: NurseGroupInterface;
  @Output() nurseGroupChange: EventEmitter<NurseGroupInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleNurses!: string[];
  @Input() selectedNurse!: string;
  @Input() possibleContracts!: string[];
  @Input() selectedContract!: string;
  @Input() possibleContractsGroup!: string[];
  @Input() selectedContractGroup!: string;
  @Input() nurseGroups!: string[]
  @Input() imported: boolean

  nameNurseGroupFormCtrl: FormControl;
  contractSelectorError: boolean;
  contractGroupSelectorError: boolean;
  nurseSelectorError: boolean;
  inputDisabled: boolean;
  nursesError: boolean;
  contractsError: boolean;
  contractsGroupError: boolean;
  nurseGroupStartname!: string;

  localContracts: string[]
  localContractGroups:string[]
  localNurses: string[]



  constructor(){
    this.nurseGroupChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false;
    this.nameNurseGroupFormCtrl = new FormControl(null, Validators.required);
    this.contractSelectorError = true;
    this.contractGroupSelectorError = true;
    this.nurseSelectorError = true;
    this.inputDisabled = false;
    this.contractsError = true;
    this.contractsGroupError = true;
    this.nursesError = true;
    this.localContracts = []
    this.localContractGroups = []
    this.localNurses = []
  }

  ngOnInit(): void {
    this.inputDisabled = this.nurseGroup.name === "" || this.imported? false: true;
    this.nameNurseGroupFormCtrl = new FormControl({value: this.nurseGroup.name, disabled: this.inputDisabled},
      Validators.required);
    this.nurseGroupStartname = this.nurseGroup.name;

    for(let i=0; i< this.nurseGroup.contracts.length; i++) {
      if(!this.possibleContracts.includes(this.nurseGroup.contracts[i])){
        this.nurseGroup.contracts.splice(i, 1);
      }
    }

    for(let i=0; i< this.nurseGroup.contract_groups.length; i++) {
      if(!this.possibleContractsGroup.includes(this.nurseGroup.contract_groups[i])){
        this.nurseGroup.contract_groups.splice(i, 1);
      }
    }

    for(let i=0; i< this.nurseGroup.nurses.length; i++) {
      if(!this.possibleNurses.includes(this.nurseGroup.nurses[i])){
        this.nurseGroup.nurses.splice(i, 1);
      }
    }
    this.emitNurseGroup();
    this.updateLocalLists()
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
      this.updateLocalLists()
  }
  
  updateLocalLists(){
    this.localContracts = [...this.possibleContracts];
    this.localContractGroups = [...this.possibleContractsGroup];
    this.localNurses = [...this.possibleNurses]
    this.nurseGroup.contracts.forEach((c: string)=>{
      const index = this.localContracts.indexOf(c)
      if(index > -1){
        this.localContracts.splice(index, 1)
      }
    })
    this.nurseGroup.contract_groups.forEach((cg: string)=>{
      const index = this.localContractGroups.indexOf(cg)
      if(index > -1){
        this.localContracts.splice(index, 1)
      }
    })
    this.nurseGroup.nurses.forEach((n: string)=>{
      const index = this.localNurses.indexOf(n)
      if(index > -1){
        this.localNurses.splice(index, 1)
      }
    })
    if(this.localContracts.length > 0){
      this.selectedContract = this.localContracts[0]
    }
    if(this.localContractGroups,length > 0){
      this.selectedContractGroup = this.localContractGroups[0]
    }
    if(this.localNurses.length > 0){
      this.selectedNurse = this.localNurses[0]
    }
  }

  addContract() {
    const index = this.localContracts.indexOf(this.selectedContract);
    if (index > -1) {
      this.localContracts.splice(index, 1);
    }
    this.nurseGroup.contracts.push(this.selectedContract);
    if (this.localContracts.length > 0) {
        this.selectedContract= this.localContracts[0];
    }
    this.contractSelectorError = false;
    this.emitNurseGroup();
  }
  
  removeContract(contract: string) {
    const index = this.nurseGroup.contracts.indexOf(contract);
    if (index > -1) {
      this.nurseGroup.contracts.splice(index, 1);
    }
    if (contract !== undefined && contract !== null) {
      this.localContracts.push(contract);
      this.selectedContract = this.localContracts[0]
    }
    if(this.nurseGroup.contracts.length === 0){
      this.contractSelectorError = true;
    } 
    this.emitNurseGroup()
  }

  addContractGroup() {
    const index = this.localContractGroups.indexOf(this.selectedContractGroup);
    if (index > -1) {
      this.localContractGroups.splice(index, 1);
    }
    this.nurseGroup.contract_groups.push(this.selectedContractGroup);
    if (this.localContractGroups.length > 0) {
        this.selectedContractGroup= this.localContractGroups[0];
    }
    this.contractGroupSelectorError = false;
    this.emitNurseGroup();
  }
  
  removeContractGroup(contractGroup: string) {
    const index = this.nurseGroup.contract_groups.indexOf(contractGroup);
    if (index > -1) {
      this.nurseGroup.contract_groups.splice(index, 1);
    }
    if (contractGroup !== undefined && contractGroup !== null) {
      this.localContractGroups.push(contractGroup);
      this.selectedContractGroup = this.localContractGroups[0]
    }
    if(this.nurseGroup.contract_groups.length === 0){
      this.contractGroupSelectorError = true;
    } 
    this.emitNurseGroup()
  }

  addNurse() {
    const index = this.possibleNurses.indexOf(this.selectedNurse);
    if (index > -1) {
      this.possibleNurses.splice(index, 1);
    }
    this.nurseGroup.nurses.push(this.selectedNurse);
    if (this.possibleNurses.length > 0) {
        this.selectedNurse = this.possibleNurses[0];
    }
    this.nurseSelectorError = false;
    this.emitNurseGroup();
  }
  
  removeNurse(nurse: string) {
    const index = this.nurseGroup.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurseGroup.nurses.splice(index, 1);
    }
    if (nurse !== undefined && nurse !== null) {
      this.possibleNurses.push(nurse);
      this.selectedNurse = this.possibleNurses[0];
    }
    if(this.nurseGroup.nurses.length === 0){
      this.nurseSelectorError = true;
    } 
    this.emitNurseGroup()
  }


  emitNurseGroup(){
    this.nurseGroupChange.emit(this.nurseGroup);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.nameNurseGroupFormCtrl.hasError('required') || 
    this.nameNurseGroupFormCtrl.hasError('required') || 
    (this.nameExist() && this. nurseGroupStartname === '') ||
    this.nurseGroup.contracts.length === 0 || (this.nurseGroup.contract_groups.length === 0 && this.nurseGroup.nurses.length === 0 ));
    console.log("error");
  }

  nameExist(): boolean {
    const temp = [...this.nurseGroups]
    if(this.imported){
      const index = temp.indexOf(this.nurseGroup.name)
      if(index > -1){
        temp.splice(index, 1)
      }
    }
    return temp.includes(this.nurseGroup.name);
  }

}
