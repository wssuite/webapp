import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PatternElement } from 'src/app/models/PatternElement';
import { DateUtils } from 'src/app/utils/DateUtils';

@Component({
  selector: 'app-pattern-element',
  templateUrl: './pattern-element.component.html',
  styleUrls: ['./pattern-element.component.css']
})
export class PatternElementComponent implements OnInit{

  possibleDays: string[]

  @Input() possibleShifts!: string[]
  @Input() element!: PatternElement

  @Output() elementChange: EventEmitter<PatternElement>
  @Output() errorState: EventEmitter<boolean>

  daySelectorFormControl: FormControl;
  shiftSelectorFormControl: FormControl;

  constructor() {
    this.possibleDays = DateUtils.days;
    this.elementChange = new EventEmitter<PatternElement>();
    this.errorState = new EventEmitter<boolean>();
    this.daySelectorFormControl = new FormControl(null, Validators.required);
    this.shiftSelectorFormControl = new FormControl(null, Validators.required);
  }

  ngOnInit(): void {
    this.daySelectorFormControl.setValue(this.element.dayName);
    this.shiftSelectorFormControl.setValue(this.element.shiftId);  
  }

  emitElement(){
    this.elementChange.emit(this.element);
    this.emitErrorState();
  }

  emitErrorState() {
    this.errorState.emit(this.daySelectorFormControl.hasError('required') || this.shiftSelectorFormControl.hasError('required'))
  }
}
