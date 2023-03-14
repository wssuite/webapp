import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SkillInterface } from 'src/app/models/skill';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SkillService } from 'src/app/services/shift/skill.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { SkillCreationDialogComponent } from '../skill-creation-dialog/skill-creation-dialog.component';

@Component({
  selector: 'app-skill-view',
  templateUrl: './skill-view.component.html',
  styleUrls: ['./skill-view.component.css']
})
export class SkillViewComponent implements OnInit, AfterViewInit{
  skills: string[];
  connectedUser!:boolean;

  constructor(public dialog: MatDialog, private skillService: SkillService, private profileService: ProfileService) {
  this.skills = [];
  }

  ngOnInit(): void {
       try{
      this.getSkills();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getSkills()
    })
  }

  getSkills(){
  this.skillService.getAllSkills().subscribe({
    next: (skill: string[])=> {
      this.skills = skill;
    },
    error: (error: HttpErrorResponse)=> {
      this.openErrorDialog(error.error);
    }
  })
  }

  openSkillCreationDialog(skill: SkillInterface) {
    const dialog = this.dialog.open(SkillCreationDialogComponent,  
      { disableClose: true,  
        height: '40%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {skill:skill,skills:this.skills},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getSkills();
      })
  }

  addNewSkill(){
    const newSkill = {name: '', profile: CacheUtils.getProfile()};
    this.openSkillCreationDialog(newSkill); 
  }

  openErrorDialog(message: string) {
  this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  deleteSkill(skillName: string){
  try
  { 
    //call api service to push the contract
    this.skillService.deleteSkill(skillName).subscribe({
      error: (err: HttpErrorResponse)=> {
        if(err.status === HttpStatusCode.Ok) {
          const index = this.skills.indexOf(skillName);
          if (index > -1) {
            this.skills.splice(index, 1);
          }
        }
        else{
          this.openErrorDialog(err.error)
        }
      } 
    })
  }
  catch(e){
    console.log("error")
    this.openErrorDialog((e as Exception).getMessage())
  }
}



}
