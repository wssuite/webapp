import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PatternElement } from 'src/app/models/PatternElement';
import { DateUtils } from 'src/app/utils/DateUtils';

@Component({
  selector: 'app-pattern-element',
  templateUrl: './pattern-element.component.html',
  styleUrls: ['./pattern-element.component.css']
})
export class PatternElementComponent {

  possibleDays: string[]

  @Input() possibleShifts!: string[]
  @Input() element!: PatternElement

  @Output() elementChange: EventEmitter<PatternElement>

  constructor() {
    this.possibleDays = DateUtils.days;
    this.elementChange = new EventEmitter<PatternElement>();
  }

  emitElement(){
    this.elementChange.emit(this.element);
  }
}
