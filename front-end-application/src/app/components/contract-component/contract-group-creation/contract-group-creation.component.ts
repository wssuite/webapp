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
  @Input() imported: boolean

  nameContractGroupFormCtrl: FormControl;
  inputDisabled: boolean;
  contractsError: boolean;
  contractGroupStartname!: string;



  constructor(){
    this.contractGroupChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false
 
    this.nameContractGroupFormCtrl = new FormControl(null, Validators.required);
    this.inputDisabled = false;
    this.contractsError = true;
  }

  ngOnInit(): void {
    this.inputDisabled = this.contractGroup.name === "" ||this.imported? false: true;
    this.nameContractGroupFormCtrl = new FormControl({value: this.contractGroup.name, disabled: this.inputDisabled},
      Validators.required);
    this.contractGroupStartname = this.contractGroup.name; 

    for(let i=0; i< this.contractGroup.contracts.length; i++) {
      if(!this.possibleContracts.includes(this.contractGroup.contracts[i])){
        this.contractGroup.contracts.splice(i, 1);
      }
      else{
        const index = this.possibleContracts.indexOf(this.contractGroup.contracts[i])
        if(index > -1) {
          this.possibleContracts.splice(index, 1)
        }
      }
    }

    this.emitContractGroup();
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
    this.emitContractGroup()
  }


  emitContractGroup(){
    this.contractGroupChange.emit(this.contractGroup);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit( 
    (this.nameExist() && this. contractGroupStartname === '')  ||
    this.nameContractGroupFormCtrl.hasError('required')|| 
    this.contractGroup.contracts.length === 0 );
    console.log("error");
  }

  nameExist(): boolean {
    const temp = [...this.contractGroups];
    if(this.imported){
      const index = temp.indexOf(this.contractGroup.name)
      if(index > -1){
        temp.splice(index, -1)
      }
    }
    return temp.includes(this.contractGroup.name);
  }

}