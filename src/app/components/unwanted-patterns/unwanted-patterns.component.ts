import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BASE_VALUE } from 'src/app/constants/constraints';
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
  weightErrorState: boolean;
  weightLabel: string;

  @Input() possibleShifts!: string[];

  constructor() {
    this.constraintChange = new EventEmitter();
    this.patternErrors = [];
    this.errorState = new EventEmitter();
    this.weightErrorState = true;
    this.weightLabel = "weight";
  }

  ngOnInit(): void {
    for(let i=0; i < this.constraint.patternElements.length; i++) {
      if(this.constraint.patternElements[i].days.length === 0){
        this.patternErrors.push(true);
      }
      else{
        this.patternErrors.push(false);
      }
    }
    this.weightErrorState = this.constraint.weight === BASE_VALUE;
  }

  addPattern() {
    const newPattern: PatternElement = new PatternElement();
    this.constraint.patternElements.push(newPattern);
    this.patternErrors.push(true);
    this.emitConstraint();
  }

  removePattern(pattern:PatternElement) {
    const index = this.constraint.patternElements.indexOf(pattern);
    if(index > -1){
      this.constraint.patternElements.splice(index, 1);
      this.patternErrors.splice(index, 1);
    }
    this.emitConstraint();
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  changePatternErrorState(index: number, e: boolean) {
    this.patternErrors[index] = e;
    this.emitConstraint();
    console.log(this.patternErrors);
  }

  emitErrorState() {
    let errorState = false;
    if(this.patternErrors.indexOf(true) > -1 || this.weightErrorState === true) {
      errorState = true;
    }
    this.errorState.emit(errorState);
  }
  
  updateWeightErrorState(e:boolean) {
    this.weightErrorState = e;
    console.log(this.weightErrorState);
    this.emitConstraint();
  }
}
