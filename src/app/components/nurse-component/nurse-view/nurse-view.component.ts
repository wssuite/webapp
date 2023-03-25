import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { NurseInterface } from "src/app/models/Nurse";
import { NurseService } from "src/app/services/nurse/nurse.service";
import { ProfileService } from "src/app/services/profile/profile.service";
import { CacheUtils } from "src/app/utils/CacheUtils";
import { Exception } from "src/app/utils/Exception";
import { ErrorMessageDialogComponent } from "../../error-message-dialog/error-message-dialog.component";
import { NurseCreationDialogComponent } from "../nurse-creation-dialog/nurse-creation-dialog.component";

@Component({
  selector: "app-nurse-view",
  templateUrl: "./nurse-view.component.html",
  styleUrls: ["./nurse-view.component.css"],
})
export class NurseViewComponent implements OnInit, AfterViewInit{
  
  nurses_username: string[];
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<NurseInterface>;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  constructor(public dialog: MatDialog, private nurseService: NurseService, private profileService: ProfileService) {
    this.nurses_username = [];
    this.displayedColumns =  ['name', 'username', 'contracts','actions'];
    this.dataSource = new MatTableDataSource();



    
  }
  ngOnInit(): void {
    try{
      this.getNurses();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getNurses();
    })  
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  getNurses(){
    this.nurseService.getAllNurseUsername().subscribe({
      next: (username: string[])=> {
        this.nurses_username = username;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.nurseService.getAllNurse().subscribe({
      next: (nurse: NurseInterface[])=> {
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

  openNurseCreationDialog(nurse: NurseInterface) {
    const dialog = this.dialog.open(NurseCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {nurse:nurse,nurses:this.nurses_username},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getNurses();
      })
  }


  createNewNurse(){
    const newNnurse = {name: '',username: '', contracts:[], profile: CacheUtils.getProfile()};
    this.openNurseCreationDialog(newNnurse); 
  }


  deleteNurse(nurseUsername: string){
    try
    { 
      //call api service to push the contract
      this.nurseService.removeNurse(nurseUsername).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.nurses_username.indexOf(nurseUsername);
            if (index > -1) {
              this.nurses_username.splice(index, 1);
              this.getNurses();
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

  modifyNurse(nurse_username: string){
    this.nurseService.getNurseByUserName(nurse_username).subscribe({
      next:(nurse: NurseInterface) =>{
        this.openNurseCreationDialog(nurse);
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
