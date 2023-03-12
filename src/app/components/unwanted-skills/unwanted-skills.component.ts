import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BASE_VALUE } from 'src/app/constants/constraints';
import { UnwantedSkills } from 'src/app/models/UnwantedSkills';

@Component({
  selector: 'app-unwanted-skills',
  templateUrl: './unwanted-skills.component.html',
  styleUrls: ['./unwanted-skills.component.css']
})
export class UnwantedSkillsComponent implements OnInit{

  @Input() constraint!: UnwantedSkills;
  @Input() skills!: string[];
  skillsFormCtrl: FormControl[];

  @Output() errorState: EventEmitter<boolean>;
  @Output() constraintChange: EventEmitter<UnwantedSkills>;
  weightLabel: string;
  weightError: boolean;

  constructor(){
    this.errorState = new EventEmitter();
    this.constraintChange = new EventEmitter();
    this.skillsFormCtrl = [];
    this.weightLabel = "weight";
    this.weightError = true;
  }

  ngOnInit(): void {
    for(const skill of this.constraint.skills){
      const newFormControl = this.createFormControl();
      newFormControl.setValue(skill);
      this.skillsFormCtrl.push(newFormControl);
    }
    this.weightError = this.constraint.weight === BASE_VALUE;
  }

  createFormControl(): FormControl {
    return new FormControl(null, Validators.required);
  }

  updateWeightErrorState(e: boolean){
    this.weightError = e;
    this.emitConstraint();
  }

  emitConstraint() {
    this.constraintChange.emit(this.constraint);
    this.emitErrorState();
  }

  emitErrorState(){
    let skillsError = false;
    for(const form of this.skillsFormCtrl){
      if(form.hasError('required')){
        skillsError = true;
        break;
      }
    }
    this.errorState.emit(skillsError || this.weightError);
  }
  
  addSkill() {
    this.constraint.skills.push("");
    this.skillsFormCtrl.push(this.createFormControl());
    this.emitConstraint();
  }

  deleteSkill(index: number) {
    this.constraint.skills.splice(index, 1);
    this.skillsFormCtrl.splice(index,1);
    this.emitConstraint();
  }

  trackByFn(index: number): number {
    return index;
  }
}
