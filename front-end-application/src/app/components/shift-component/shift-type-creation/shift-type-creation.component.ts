import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftTypeInterface } from 'src/app/models/Shift';

@Component({
  selector: 'app-shift-type-creation',
  templateUrl: './shift-type-creation.component.html',
  styleUrls: ['./shift-type-creation.component.css']
})
export class ShiftTypeCreationComponent implements OnInit, OnChanges {
  @Input() shiftType!: ShiftTypeInterface;
  @Output() shiftTypeChange: EventEmitter<ShiftTypeInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() possibleShifts!: string[];
  @Input() selectedShift!: string;
  @Input() shiftsType!: string[]
  @Input() imported: boolean;

  nameShiftTypeFormCtrl: FormControl;
  shiftTypeSelectorError: boolean;
  inputDisabled: boolean;
  shiftTypeStartName!: string;
  localShifts: string[]


  constructor(){
    this.shiftTypeChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false;
    this.nameShiftTypeFormCtrl = new FormControl(null, Validators.required);
    this.shiftTypeSelectorError = true;
    this.inputDisabled = false;
    this.localShifts = [] 
  }

  ngOnInit(): void {
    this.inputDisabled = this.shiftType.name === "" || this.imported? false: true;
    this.nameShiftTypeFormCtrl = new FormControl({value: this.shiftType.name, disabled: this.inputDisabled},
      Validators.required);
    this.shiftTypeStartName = this.shiftType.name;
    for(let i=0; i < this.shiftType.shifts.length; i++){
      if(!this.possibleShifts.includes(this.shiftType.shifts[i])){
        this.shiftType.shifts.splice(i,1);
      }
    }
    this.updateShifts()
    this.emitShiftType()
   
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
      this.updateShifts()
  }

  updateShifts(){
    this.localShifts = [...this.possibleShifts]
    this.shiftType.shifts.forEach((s: string)=>{
      const index = this.localShifts.indexOf(s)
      if(index > -1){
        this.localShifts.splice(index, 1)
      }
    })
    if(this.localShifts.length > 0){
      this.selectedShift = this.localShifts[0]
    }
  }

  addShift() {
    const index = this.localShifts.indexOf(this.selectedShift);
    if (index > -1) {
      this.localShifts.splice(index, 1);
    }
    this.shiftType.shifts.push(this.selectedShift);
    if (this.localShifts.length > 0) {
        this.selectedShift= this.localShifts[0];
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
      this.localShifts.push(shift);
      this.selectedShift= this.localShifts[0];
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
    const temp = [...this.shiftsType]
    if(this.imported){
      const index = temp.indexOf(this.shiftType.name)
      if(index > -1){
        temp.splice(index, 1);
      }
    }
    return temp.includes(this.shiftType.name);
  }

}
