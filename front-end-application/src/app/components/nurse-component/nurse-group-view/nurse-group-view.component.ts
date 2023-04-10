import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NurseGroupInterface } from 'src/app/models/Nurse';
import { NurseGroupService } from 'src/app/services/nurse/nurse-group.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { NurseGroupCreationDialogComponent } from '../nurse-group-creation-dialog/nurse-group-creation-dialog.component';
import { MatPaginator } from "@angular/material/paginator";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-nurse-group0view',
  templateUrl: './nurse-group-view.component.html',
  styleUrls: ['./nurse-group-view.component.css']
})
export class NurseGroupViewComponent implements OnInit, AfterViewInit {
  
  nurseGroups: string[];
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<NurseGroupInterface>;

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


  constructor(public dialog: MatDialog, private nurseGroupService: NurseGroupService, private profileService: ProfileService) {
    this.nurseGroups = [];
    this.displayedColumns =  ['name','nurses', 'contracts', 'contract_groups','actions'];
    this.dataSource = new MatTableDataSource();
    this
  }

  ngOnInit(): void {
    try{
      this.getNurseGroups();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getNurseGroups();
    })

  }

  getNurseGroups(){
    this.nurseGroupService.getAllNurseGroupName().subscribe({
      next: (name: string[])=> {
        this.nurseGroups = name;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.nurseGroupService.getAllNurseGroup().subscribe({
      next: (nurse: NurseGroupInterface[])=> {
        this.dataSource.data = nurse;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }


  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  openNurseGroupCreationDialog(nurseGroup: NurseGroupInterface) {
    const dialog = this.dialog.open(NurseGroupCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'8vh',left: '25%', right: '25%'},
        data: {nurseGroup:nurseGroup,nurseGroups:this.nurseGroups},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getNurseGroups();
      })
  }


  createNewNurseGroup(){
    const newNurseGroup = {name: '',contracts:[], nurses:[], contract_groups:[], profile: CacheUtils.getProfile()};
    this.openNurseGroupCreationDialog(newNurseGroup); 
  }


  deleteNurseGroup(groupName: string){
    try
    { 
      //call api service to push the contract
      this.nurseGroupService.removeNurseGroup(groupName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.nurseGroups.indexOf(groupName);
            if (index > -1) {
              this.nurseGroups.splice(index, 1);
              this.getNurseGroups();
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

  modifyNurseGroup(groupName: string){
    this.nurseGroupService.getNurseGroupByName(groupName).subscribe({
      next:(nurseGroup: NurseGroupInterface) =>{
        this.openNurseGroupCreationDialog(nurseGroup);
      },
      error: (error: HttpErrorResponse)=>{
        this.openErrorDialog(error.error);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}

