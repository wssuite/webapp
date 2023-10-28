import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ShiftGroupInterface } from 'src/app/models/Shift';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ShiftGroupService } from 'src/app/services/shift/shift-group.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftGroupCreationDialogComponent } from '../shift-group-creation-dialog/shift-group-creation-dialog.component';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-shifts-group-view',
  templateUrl: './shifts-group-view.component.html',
  styleUrls: ['./shifts-group-view.component.css']
})
export class ShiftGroupViewComponent implements OnInit, AfterViewInit{
  shiftsGroup: string[];
  connectedUser!: boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<ShiftGroupInterface>;

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

  constructor(public dialog: MatDialog, private shiftGroupService: ShiftGroupService, private profileService: ProfileService) {
    this.shiftsGroup = [];
    this.displayedColumns =  ['name', 'shifts', 'shiftTypes', 'actions'];
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit(): void {
    try{
      this.getShiftsGroup();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
    this.profileService.profileChanged.subscribe(()=>{
      this.getShiftsGroup();
    })
  }

  getShiftsGroup(){
    this.shiftGroupService.getShiftGroupNames().subscribe({
      next: (shiftsGroup: string[])=> {
        this.shiftsGroup = shiftsGroup;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.shiftGroupService.getAllShiftGroup().subscribe({
      next: (shiftGroup: ShiftGroupInterface[])=> {
        this.dataSource.data = shiftGroup;
        console.log(this.dataSource.data)
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%', 
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message},
    })
  }

  openShiftGroupCreationDialog(shiftGroup: ShiftGroupInterface) {
    const dialog = this.dialog.open(ShiftGroupCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'8vh',left: '25%', right: '25%'},
        data: {shiftGroup:shiftGroup, shiftsGroup:this.shiftsGroup}
      });

    dialog.afterClosed().subscribe(()=>{
        this.getShiftsGroup();
      })
  }

   createNewShiftGroup(){
    const newShiftGroup = {name: '', shifts: [], shiftTypes: [], profile: CacheUtils.getProfile()};
    this.openShiftGroupCreationDialog(newShiftGroup); 
  }

  deleteShiftGroup(shiftGroupName: string){
    try
    { 
      const dialog = this.dialog.open(ConfirmationDialogComponent,  
        { disableClose: true,  
          height: '50%',
          width: '28%', 
          position: {top:'20vh',left: '38%', right: '25%'},
          data: {message: "shift group", elementName: shiftGroupName}
        });
      dialog.afterClosed().subscribe((result: boolean)=>{
        if(result){
          //call api service to push the contract
          this.shiftGroupService.removeShiftGroup(shiftGroupName).subscribe({
            error: (err: HttpErrorResponse)=> {
              if(err.status === HttpStatusCode.Ok) {
                const index = this.shiftsGroup.indexOf(shiftGroupName);
                if (index > -1) {
                  this.shiftsGroup.splice(index, 1);
                  this.getShiftsGroup();
                }
              }
              else{
                this.openErrorDialog(err.error)
              }
            } 
          })
        }
      })
    }
    catch(e){
      console.log("error")
      this.openErrorDialog((e as Exception).getMessage())
    }
  }

  modifyShiftGroup(shiftGroupName: string){
    this.shiftGroupService.getShiftGroupByName(shiftGroupName).subscribe({
      next:(shiftGroup: ShiftGroupInterface) =>{
        this.openShiftGroupCreationDialog(shiftGroup);
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


