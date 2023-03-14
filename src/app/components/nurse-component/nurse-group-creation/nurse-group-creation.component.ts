import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NurseGroupInterface } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse-group-creation',
  templateUrl: './nurse-group-creation.component.html',
  styleUrls: ['./nurse-group-creation.component.css']
})
export class NurseGroupCreationComponent implements OnInit {
  @Input() nurseGroup!: NurseGroupInterface;
  @Output() nurseGroupChange: EventEmitter<NurseGroupInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleNurses!: string[];
  @Input() selectedNurse!: string;
  @Input() possibleContracts!: string[];
  @Input() selectedContract!: string;
  @Input() nurseGroups!: string[]

  nameNurseGroupFormCtrl: FormControl;
  contractSelectorError: boolean;
  nurseSelectorError: boolean;
  inputDisabled: boolean;
  nursesError: boolean;
  contractsError: boolean;
  nurseGroupStartname!: string;



  constructor(){
    this.nurseGroupChange = new EventEmitter();
    this.errorState = new EventEmitter();
 
    this.nameNurseGroupFormCtrl = new FormControl(null, Validators.required);
    this.contractSelectorError = true;
    this.nurseSelectorError = true;
    this.inputDisabled = false;
    this.contractsError = true;
    this.nursesError = true;
  }

  ngOnInit(): void {
    this.inputDisabled = this.nurseGroup.name === ""? false: true;
    this.nameNurseGroupFormCtrl = new FormControl({value: this.nurseGroup.name, disabled: this.inputDisabled},
      Validators.required);
    this.nurseGroupStartname = this.nurseGroup.name; 
  }

  addContract() {
    const index = this.possibleContracts.indexOf(this.selectedContract);
    if (index > -1) {
      this.possibleContracts.splice(index, 1);
    }
    this.nurseGroup.contracts.push(this.selectedContract);
    if (this.possibleContracts.length > 0) {
        this.selectedContract= this.possibleContracts[0];
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
      this.possibleContracts.push(contract);
    }
    if(this.nurseGroup.contracts.length === 0){
      this.contractSelectorError = true;
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
    const index = this.nurseGroup.contracts.indexOf(nurse);
    if (index > -1) {
      this.nurseGroup.nurses.splice(index, 1);
    }
    if (nurse !== undefined && nurse !== null) {
      this.possibleContracts.push(nurse);
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
    this.errorState.emit(this.nameNurseGroupFormCtrl.hasError('required') || this.nameNurseGroupFormCtrl.hasError('required') || (this.nameExist() && this. nurseGroupStartname === '') ||this.contractSelectorError ||this.nameNurseGroupFormCtrl.hasError('required') || (this.nameExist() && this.nurseGroupStartname === '') || this.contractSelectorError || this.nurseSelectorError );
    console.log("error");
  }

  nameExist(): boolean {
    return this.nurseGroups.includes(this.nurseGroup.name);
  }

}
