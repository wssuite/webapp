import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ShiftGroupInterface } from 'src/app/models/Shift';

@Component({
  selector: 'app-shift-group-creation',
  templateUrl: './shift-group-creation.component.html',
  styleUrls: ['./shift-group-creation.component.css']
})
export class ShiftGroupCreationComponent implements OnInit, OnChanges{
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
  localShifts: string[]
  localShiftTypes: string[]


  constructor(){
    this.shiftGroupChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false
    this.nameShiftGroupFormCtrl = new FormControl(null, Validators.required);
    this.shiftGroupSelectorError = true;
    this.inputDisabled = false;
    this.localShifts = []
    this.localShiftTypes = []  
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
    }
    for(let i=0; i< this.shiftGroup.shiftTypes.length; i++) {
      if(!this.possibleShiftsType.includes(this.shiftGroup.shiftTypes[i])){
        this.shiftGroup.shiftTypes.splice(i, 1);
      }
    }
    this.updateLocalLists();
    this.emitShiftGroup() 
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(changes: SimpleChanges): void {
      this.updateLocalLists()
  }

  updateLocalLists(){
    this.localShifts = [...this.possibleShifts]
    this.localShiftTypes = [...this.possibleShiftsType]
    this.shiftGroup.shifts.forEach((s: string)=>{
      const index = this.localShifts.indexOf(s);
      if(index > -1){
        this.localShifts.splice(index,1)
      }
    })
    this.shiftGroup.shiftTypes.forEach((st: string)=>{
      const index = this.localShiftTypes.indexOf(st);
      if(index > -1){
        this.localShiftTypes.splice(index,1)
      }
    })
    if(this.localShifts.length > 0){
      this.selectedShift = this.localShifts[0]
    }
    if(this.localShiftTypes.length > 0){
      this.selectedShiftType = this.localShiftTypes[0]
    }
  }

  addShift() {
    const index = this.localShifts.indexOf(this.selectedShift);
    if (index > -1) {
      this.localShifts.splice(index, 1);
    }
    this.shiftGroup.shifts.push(this.selectedShift);
    if (this.localShifts.length > 0) {
        this.selectedShift= this.localShifts[0];
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
      this.localShifts.push(shift);
      this.selectedShift = this.localShifts[0]
    }
    if(this.shiftGroup.shifts.length === 0){
      this.shiftGroupSelectorError = true;
    } 
    this.emitShiftGroup()
  }

  addShiftType() {
    const index = this.possibleShiftsType.indexOf(this.selectedShiftType);
    if (index > -1) {
      this.localShiftTypes.splice(index, 1);
    }
    this.shiftGroup.shiftTypes.push(this.selectedShiftType);
    if (this.localShiftTypes.length > 0) {
        this.selectedShiftType= this.localShiftTypes[0];
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
      this.localShiftTypes.push(shiftType);
      this.selectedShiftType = this.localShiftTypes[0]
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
    const temp = [...this.shiftsGroup]
    if(this.imported){
      const index = temp.indexOf(this.shiftGroup.name)
      if(index > -1){
        temp.splice(index, 1)
      }
    }
    return temp.includes(this.shiftGroup.name);
  }

}


