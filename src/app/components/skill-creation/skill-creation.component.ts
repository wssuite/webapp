import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SkillInterface } from 'src/app/models/skill';

@Component({
  selector: 'app-skill-creation',
  templateUrl: './skill-creation.component.html',
  styleUrls: ['./skill-creation.component.css']
})
export class SkillCreationComponent implements OnInit {
  @Input() skill!: SkillInterface;
  @Output() skillChange: EventEmitter<SkillInterface>;
  @Output() errorState: EventEmitter<boolean>;
  @Input() skills!: string[]


  nameSkillFormCtrl: FormControl;
  inputDisabled: boolean;
  skillStartName!: string


  constructor(){
    this.skillChange = new EventEmitter();
    this.errorState = new EventEmitter();
 
    this.nameSkillFormCtrl = new FormControl(null, Validators.required);
    this.inputDisabled = false;
    //this.skillStartName = ;
  }

  ngOnInit(): void {
    this.inputDisabled = this.skill.name === ""? false: true;
    this.skillStartName = this.skill.name;
    this.nameSkillFormCtrl = new FormControl({value: this.skill.name, disabled: this.inputDisabled},
      Validators.required);
    this.emitSkill()

  }

  emitSkill(){
    this.skillChange.emit(this.skill);
    this.emitErrorState();
  }

  emitErrorState() {
    console.log(this.skillStartName);
    this.errorState.emit(this.nameSkillFormCtrl.hasError('required') || (this.nameExist() && this.skillStartName == "") );
    console.log("error");
  }

  nameExist(): boolean {
    return this.skills.includes(this.skill.name);
  }


}
