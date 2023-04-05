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
  @Input() imported: boolean;


  nameSkillFormCtrl: FormControl;
  inputDisabled: boolean;
  skillStartName!: string


  constructor(){
    this.skillChange = new EventEmitter();
    this.errorState = new EventEmitter();
    this.imported = false;
    this.nameSkillFormCtrl = new FormControl(null, Validators.required);
    this.inputDisabled = false;
    //this.skillStartName = ;
  }

  ngOnInit(): void {
    this.skill.name = this.skill.name.replace(/[^a-zA-Z0-9]/, '')
    this.inputDisabled = this.skill.name === "" || this.imported? false: true;
    this.skillStartName = this.skill.name;
    console.log(this.skill.name)
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
    if(this.imported){
      const index = this.skills.indexOf(this.skill.name)
      if(index > -1){
        this.skills.splice(index, 1);
      }
    }
    return this.skills.includes(this.skill.name);
  }


}
