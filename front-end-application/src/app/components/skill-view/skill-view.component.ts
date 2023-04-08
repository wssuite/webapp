import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<string>;

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }

  constructor(public dialog: MatDialog, private skillService: SkillService, private profileService: ProfileService) {
  this.skills = [];
      this.displayedColumns =  ['name','actions'];
    this.dataSource = new MatTableDataSource();
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
      this.dataSource.data = skill;
    },
    error: (error: HttpErrorResponse)=> {
      this.openErrorDialog(error.error);
    }
  })
  }

  openSkillCreationDialog(skill: SkillInterface) {
    const dialog = this.dialog.open(SkillCreationDialogComponent,  
      { disableClose: true,  
        height: '32%',
        width: '30%', 
        position: {top:'10vh',left: '35%', right: '35%'},
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
          this.getSkills();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
