import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SkillInterface } from 'src/app/models/skill';
import { SkillService } from 'src/app/services/shift/skill.service';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-skill-creation-dialog',
  templateUrl: './skill-creation-dialog.component.html',
  styleUrls: ['./skill-creation-dialog.component.css']
})
export class SkillCreationDialogComponent {
  @Output() errorState: EventEmitter<boolean>;
  skillErrorState: boolean;
  constructor(public dialogRef: MatDialogRef<SkillCreationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {skill: SkillInterface, skills: string[]},  
    private api: SkillService,
    private dialog: MatDialog,                                       
    ) { 
      this.errorState = new EventEmitter();
      this.skillErrorState = true;
  }

  add() {
    try
    { 
      console.log(this.data.skill);
      this.api.addSkill(this.data.skill).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.close();
          }
          else{
            this.openErrorDialog(err.error)
          }
        } 
      })
  }
  catch(e){
    this.openErrorDialog((e as Exception).getMessage())
  }
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%', 
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message},
    })
  }

  close(){
    this.dialogRef.close();
  }

  updateSkillErrorState(e: boolean) {
    console.log("update")
    this.skillErrorState = e;
  }

}
