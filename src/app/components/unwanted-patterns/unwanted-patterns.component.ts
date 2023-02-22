import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { shiftsExample } from 'src/app/constants/shifts';
import { PatternElement } from 'src/app/models/PatternElement';
import { UnwantedPatterns } from 'src/app/models/UnwantedPatterns';

@Component({
  selector: 'app-unwanted-patterns',
  templateUrl: './unwanted-patterns.component.html',
  styleUrls: ['./unwanted-patterns.component.css']
})
export class UnwantedPatternsComponent implements OnInit {

  @Input() constraint!: UnwantedPatterns;
  @Output() constraintChange: EventEmitter<UnwantedPatterns>;
  patternErrors: boolean[];
  @Output() errorState: EventEmitter<boolean>;

  possibleShifts: string[];

  constructor() {
    this.constraintChange = new EventEmitter();
    this.possibleShifts = shiftsExample;
    this.patternErrors = [];
    this.errorState = new EventEmitter();
  }

  ngOnInit(): void {
    for(let i=0; i < this.constraint.patternElements.length; i++) {
      this.patternErrors.push(true);
    }
  }

  addPattern() {
    const newPattern: PatternElement = {
      dayName:'',
      shiftId:'',
    };
    this.constraint.patternElements.push(newPattern);
    this.patternErrors.push(true);
  }

  removePattern(pattern:PatternElement) {
    const index = this.constraint.patternElements.indexOf(pattern);
    if(index > -1){
      this.constraint.patternElements.splice(index, 1);
      this.patternErrors.splice(index, 1);
    }
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
  }

  changePatternErrorState(index: number, e: boolean) {
    this.patternErrors[index] = e;
    this.emitErrorState();
  }

  emitErrorState() {
    let errorState = false;
    if(this.patternErrors.indexOf(true) > -1) {
      errorState = true;
    }
    this.errorState.emit(errorState);
  }
}
