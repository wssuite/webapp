import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftTypeInterface } from 'src/app/models/Shift';

@Component({
  selector: 'app-shift-type-creation',
  templateUrl: './shift-type-creation.component.html',
  styleUrls: ['./shift-type-creation.component.css']
})
export class ShiftTypeCreationComponent implements OnInit {
  @Input() shiftType!: ShiftTypeInterface;
  @Output() shiftTypeChange: EventEmitter<ShiftTypeInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleShifts!: string[];
  @Input() selectedShift!: string;
  @Input() shiftsType!: string[]

  nameShiftTypeFormCtrl: FormControl;
  shiftTypeSelectorError: boolean;
  inputDisabled: boolean;
  shiftTypeStartName!: string;


  constructor(){
    this.shiftTypeChange = new EventEmitter();
    this.errorState = new EventEmitter();
 
    this.nameShiftTypeFormCtrl = new FormControl(null, Validators.required);
    this.shiftTypeSelectorError = true;
    this.inputDisabled = false; 
  }

  ngOnInit(): void {
    this.inputDisabled = this.shiftType.name === ""? false: true;
    this.nameShiftTypeFormCtrl = new FormControl({value: this.shiftType.name, disabled: this.inputDisabled},
      Validators.required);
    this.shiftTypeStartName = this.shiftType.name;
    this.emitShiftType()
   
  }

  addShift() {
    const index = this.possibleShifts.indexOf(this.selectedShift);
    if (index > -1) {
      this.possibleShifts.splice(index, 1);
    }
    this.shiftType.shifts.push(this.selectedShift);
    if (this.possibleShifts.length > 0) {
        this.selectedShift= this.possibleShifts[0];
    }
    this.shiftTypeSelectorError = false;
    this.emitShiftType();
  }
  
  removeShift(shift: string) {
    const indexShiftType = this.shiftType.shifts.indexOf(shift);
    if (indexShiftType > -1) {
      this.shiftType.shifts.splice(indexShiftType, 1);
    }
    if (shift !== undefined && shift !== null) {
      this.possibleShifts.push(shift);
    }
    if(this.shiftType.shifts.length === 0){
      this.shiftTypeSelectorError = true;
    } 
    this.emitShiftType()
  }


  emitShiftType(){
    this.shiftTypeChange.emit(this.shiftType);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.nameShiftTypeFormCtrl.hasError('required') || (this.nameExist() && this.shiftTypeStartName === '') || this.shiftType.shifts.length === 0);
    console.log("error");
  }

  nameExist(): boolean {
    return this.shiftsType.includes(this.shiftType.name);
  }

}
