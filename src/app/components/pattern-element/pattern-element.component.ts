import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CustomSelector } from 'src/app/models/CustomSelector';
import { PatternElement } from 'src/app/models/PatternElement';
import { DateUtils } from 'src/app/utils/DateUtils';

@Component({
  selector: 'app-pattern-element',
  templateUrl: './pattern-element.component.html',
  styleUrls: ['./pattern-element.component.css']
})
export class PatternElementComponent implements OnInit{

  possibleDays: string[]
  customSelectorDays: CustomSelector[];
  customSelectorShifts: CustomSelector[];


  @Input() possibleShifts!: string[]
  @Input() element!: PatternElement

  @Output() elementChange: EventEmitter<PatternElement>
  @Output() errorState: EventEmitter<boolean>

  daySelectorFormControl: FormControl;
  shiftSelectorFormControl: FormControl;


  constructor() {
    this.possibleDays = DateUtils.days;
    this.customSelectorDays = [
      new CustomSelector("Weekdays", DateUtils.weekdays),
      new CustomSelector("Weekend", DateUtils.weekendDays),
    ];

    this.customSelectorShifts = [];

    this.elementChange = new EventEmitter<PatternElement>();
    this.errorState = new EventEmitter<boolean>();
    this.daySelectorFormControl = new FormControl(null, Validators.required);
    this.shiftSelectorFormControl = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    this.daySelectorFormControl.setValue(this.element.days);
    this.shiftSelectorFormControl.setValue(this.element.shifts);  
  }

  emitElement(){
    this.elementChange.emit(this.element);
    this.emitErrorState();
  }

  emitErrorState() {
    const noDaySelected = this.element.days.length == 0;
    const noShiftSelected = this.element.shifts.length == 0;
    this.errorState.emit(noDaySelected || noShiftSelected);
  }
}
