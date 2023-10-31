import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NurseInterface } from 'src/app/models/Nurse';


export function usernameExistsValidator(nurses: string[], minOccurences: number): ValidatorFn {
  return (control:AbstractControl) : ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    let counter = 0;
    for(let n of nurses) {
      if(n === value) {
        counter += 1
        if (counter > minOccurences) {
          return {exists:true}
        }
      }
    }
    return null;
  }
}



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
  namePattern: string = "^[a-zA-Z0-9\-\.\_]+$"
  usernameEdited: boolean;
  contractSelectorError: boolean;
  contractGroupSelectorError: boolean;
  inputDisabled: boolean;
  contractsError: boolean;
  contractsGroupError: boolean;
  localContracts: string[]
  localContractGroups: string[]

  constructor(){
    this.nurseChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.usernameEdited = false;
    this.imported = false
    this.usernameNurseFormCtrl = new FormControl();
    this.nameNurseFormCtrl = new FormControl();
    this.contractSelectorError = true;
    this.contractGroupSelectorError= true;
    this.inputDisabled = false;
    this.contractsError = true;
    this.contractsGroupError = true;
    this.localContracts = []
    this.localContractGroups = []
  }

  ngOnInit(): void {
    this.inputDisabled = this.nurse.username === "" || this.nurse.name === ""
                         || this.imported ? false: true;
    this.usernameNurseFormCtrl = new FormControl({
      value: this.nurse.username,
      disabled: this.inputDisabled
    }, [Validators.required, Validators.pattern(this.namePattern),
        usernameExistsValidator(this.nurses, this.imported ? 1 : 0)]);
    this.nameNurseFormCtrl = new FormControl({
      value: this.nurse.name,
      disabled: this.inputDisabled
    }, Validators.required);

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
    this.errorState.emit( this.nameErrorState() || this.usernameErrorState() ||
     this.contractErrorState() );
  }

  nameRequiredErrorState() {
    return this.nameNurseFormCtrl.hasError('required');
  }

  nameErrorState() {
    return this.nameRequiredErrorState();
  }

  usernameRequiredErrorState() {
    return this.usernameNurseFormCtrl.hasError('required');
  }

  usernamePatternErrorState() {
    return this.usernameNurseFormCtrl.hasError('pattern');
  }

  usernameExistsErrorState(): boolean {
    return this.usernameNurseFormCtrl.hasError('exists');
  }

  usernameErrorState() {
    return this.usernameRequiredErrorState() ||
           this.usernamePatternErrorState() ||
           this.usernameExistsErrorState();
  }

  contractErrorState() {
    return this.nurse.contracts.length === 0 &&
           this.nurse.contract_groups.length === 0;
  }

  setName(){
    this.nurse.name = this.nameNurseFormCtrl.value
    if (!this.usernameEdited) {
      this.nurse.username = this.nurse.name;
      let counter = 1;
      while(this.nurses.includes(this.nurse.username)){
        this.nurse.username = this.nurse.name + counter.toString();
        counter++;
      }
      this.usernameNurseFormCtrl.setValue(this.nurse.username)
    }
    this.emitNurse()
  }

  setUsername() {
    this.usernameEdited = true;
    this.nurse.username = this.usernameNurseFormCtrl.value
    this.emitNurse()
  }
}
