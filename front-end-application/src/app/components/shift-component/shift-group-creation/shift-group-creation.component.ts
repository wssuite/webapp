import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftGroupInterface } from 'src/app/models/Shift';

@Component({
  selector: 'app-shift-group-creation',
  templateUrl: './shift-group-creation.component.html',
  styleUrls: ['./shift-group-creation.component.css']
})
export class ShiftGroupCreationComponent implements OnInit{
  @Input() shiftGroup!: ShiftGroupInterface;
  @Output() shiftGroupChange: EventEmitter<ShiftGroupInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleShifts!: string[];
  @Input() selectedShift!: string;
  @Input() possibleShiftsType!: string[];
  @Input() selectedShiftType!: string;
  @Input() shiftsGroup!: string[]
  @Input() imported: boolean;

  nameShiftGroupFormCtrl: FormControl;
  shiftGroupSelectorError: boolean;
  inputDisabled: boolean;
  shiftGroupStartName!: string;



  constructor(){
    this.shiftGroupChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false
    this.nameShiftGroupFormCtrl = new FormControl(null, Validators.required);
    this.shiftGroupSelectorError = true;
    this.inputDisabled = false;  
  }

  ngOnInit(): void {
    this.inputDisabled = this.shiftGroup.name === "" || this.imported? false: true;
    this.nameShiftGroupFormCtrl = new FormControl({value: this.shiftGroup.name, disabled: this.inputDisabled},
      Validators.required);
    this.shiftGroupStartName = this.shiftGroup.name;
    for(let i=0; i< this.shiftGroup.shifts.length; i++) {
      if(!this.possibleShifts.includes(this.shiftGroup.shifts[i])){
        this.shiftGroup.shifts.splice(i, 1);
      }
      else{
        const index = this.possibleShifts.indexOf(this.shiftGroup.shifts[i])
        if(index > -1){
          this.possibleShifts.splice(index, 1);
        }
      }
    }
    for(let i=0; i< this.shiftGroup.shiftTypes.length; i++) {
      if(!this.possibleShiftsType.includes(this.shiftGroup.shiftTypes[i])){
        this.shiftGroup.shiftTypes.splice(i, 1);
      }
      else{
        const index = this.possibleShiftsType.indexOf(this.shiftGroup.shiftTypes[i])
        if(index > -1){
          this.possibleShiftsType.splice(index, 1);
        }
      }
    }
    this.emitShiftGroup() 
  }

  addShift() {
    const index = this.possibleShifts.indexOf(this.selectedShift);
    if (index > -1) {
      this.possibleShifts.splice(index, 1);
    }
    this.shiftGroup.shifts.push(this.selectedShift);
    if (this.possibleShifts.length > 0) {
        this.selectedShift= this.possibleShifts[0];
    }
    this.shiftGroupSelectorError = false;
    this.emitShiftGroup();
  }
  
  removeShift(shift: string) {
    const indexShiftGroup = this.shiftGroup.shifts.indexOf(shift);
    if (indexShiftGroup > -1) {
      this.shiftGroup.shifts.splice(indexShiftGroup, 1);
    }
    if (shift !== undefined && shift !== null) {
      this.possibleShifts.push(shift);
    }
    if(this.shiftGroup.shifts.length === 0){
      this.shiftGroupSelectorError = true;
    } 
    this.emitShiftGroup()
  }

  addShiftType() {
    const index = this.possibleShiftsType.indexOf(this.selectedShiftType);
    if (index > -1) {
      this.possibleShiftsType.splice(index, 1);
    }
    this.shiftGroup.shiftTypes.push(this.selectedShiftType);
    if (this.possibleShiftsType.length > 0) {
        this.selectedShiftType= this.possibleShiftsType[0];
    }
    this.shiftGroupSelectorError = false;
    this.emitShiftGroup();
  }
  
  removeShiftType(shiftType: string) {
    const indexShiftGroup = this.shiftGroup.shiftTypes.indexOf(shiftType);
    if (indexShiftGroup > -1) {
      this.shiftGroup.shiftTypes.splice(indexShiftGroup, 1);
    }
    if (shiftType !== undefined && shiftType !== null) {
      this.possibleShiftsType.push(shiftType);
    }
    if(this.shiftGroup.shiftTypes.length === 0){
      this.shiftGroupSelectorError = true;
    } 
    this.emitShiftGroup()
  }

  emitShiftGroup(){
    this.shiftGroupChange.emit(this.shiftGroup);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.nameShiftGroupFormCtrl.hasError('required') ||
     (this.nameExist() && this.shiftGroupStartName === '') ||(this.shiftGroup.shifts.length === 0 && this.shiftGroup.shiftTypes.length === 0 && this.shiftGroup.name !== "Rest"));
    console.log("error");
  }

  nameExist(): boolean {
    if(this.imported){
      const index = this.shiftsGroup.indexOf(this.shiftGroup.name)
      if(index > -1){
        this.shiftsGroup.splice(index, 1)
      }
    }
    return this.shiftsGroup.includes(this.shiftGroup.name);
  }

}


