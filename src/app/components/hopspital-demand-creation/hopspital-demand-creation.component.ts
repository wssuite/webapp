import { HttpErrorResponse } from '@angular/common/http';
import { Component,Input,OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SkillService } from 'src/app/services/shift/skill.service';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';


@Component({
  selector: 'app-hopspital-demand-creation',
  templateUrl: './hopspital-demand-creation.component.html',
  styleUrls: ['./hopspital-demand-creation.component.css']
})
export class HopspitalDemandCreationComponent implements OnInit{

  @Input() shift!: string;
  selectSkillFormCtrl: FormControl;
  possibleSkills: string[];
  selectedSkill: string;
  skills: string[];
  step = 0;
  panelOpenState = false;
  possibleShifts: string[];

  constructor(private skillService: SkillService,  private dialog: MatDialog){
    this.possibleSkills = [];
    this.selectedSkill = this.possibleSkills[0];
    this.skills = [];
    this.possibleShifts = [];
    this.selectSkillFormCtrl = new FormControl(null, Validators.required);
  }
  
  ngOnInit(): void {
    try{
      this.skillService.getAllSkills().subscribe({
        next:(skills: string[])=>{
          skills.forEach((skill: string)=>{
            this.possibleSkills.push(skill);
          })
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })

    }catch(err){
      //Do nothing
    }
     
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  addSkill() {
    const index = this.possibleSkills.indexOf(this.selectedSkill);
    if (index > -1) {
      this.possibleSkills.splice(index, 1);
    }
    this.skills.push(this.selectedSkill);
    if (this.possibleSkills.length > 0) {
        this.selectedSkill = this.possibleSkills[0];
    }
  }
  
  removeSkill(skill: string) {
    const index = this.skills.indexOf(skill);
    if (index > -1) {
      this.skills.splice(index,1);
    if (skill !== undefined && skill !== null) {
      this.possibleSkills.push(skill);
    }
  }
}

setStep(index: number) {
  this.step = index;
}

nextStep() {
  this.step++;
}

prevStep() {
  this.step--;
}

}
