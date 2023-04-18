import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component,  OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftCreationDialogComponent } from '../shift-creation-dialog/shift-creation-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../confirmation-dialog/confirmation-dialog.component';


@Component({
  selector: 'app-shifts-view',
  templateUrl: './shifts-view.component.html',
  styleUrls: ['./shifts-view.component.css']
})
export class ShiftsViewComponent implements OnInit, AfterViewInit {
  
  shifts: string[];
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<ShiftInterface>;

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

  constructor(public dialog: MatDialog, private apiService: ShiftService, private profileService: ProfileService) {
    this.shifts = [];
    this.displayedColumns =  ['name', 'startTime', 'endTime','actions'];
    this.dataSource = new MatTableDataSource();

  }

  height: string = '58%';
  width: string = '45%';
  left: string = '28%';
  top: string = '21vh';

  ngOnInit(): void {
    try{
      this.getShifts();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
      this.profileService.profileChanged.subscribe(()=>{
        this.getShifts();
      })
  }


  getShifts(){
    this.apiService.getShiftNames().subscribe({
      next: (shift: string[])=> {
        this.shifts = shift;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.apiService.getAllShift().subscribe({
      next: (shift: ShiftInterface[])=> {
        this.dataSource.data = shift;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    
    })
  }

  onResize() {
    if (window.innerWidth <= 1200) {
      this.height = '80%';
      this.width = '45%';
      this.left = '28%';
      this.top = '10vh';
    } else {
      this.height = '58%';
      this.width = '45%';
      this.left = '28%';
      this.top = '21vh';
    }
  }

  
  openShiftCreationDialog(shift: ShiftInterface) {
    this.onResize();
    const dialog = this.dialog.open(ShiftCreationDialogComponent,  
      { disableClose: true,  
        height: this.height,
        width: this.width, 
        position: {top:this.top,left: this.left, right: '25%'},
        data: {shift:shift,shifts:this.shifts},
      });
    
      dialog.afterClosed().subscribe(()=>{
        this.getShifts();
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

  createNewShift(){
    const newShift = {name: '',startTime: '', endTime:'', profile: CacheUtils.getProfile()};
    this.openShiftCreationDialog(newShift); 
  }

  deleteShift(shiftName: string){
    try
    {
      const dialog = this.dialog.open(ConfirmationDialogComponent,  
        { disableClose: true,  
          height: '50%',
          width: '28%', 
          position: {top:'20vh',left: '38%', right: '25%'},
          data: {message: "shift", elementName:shiftName}
        });
      dialog.afterClosed().subscribe((result: boolean)=>{
        if(result){
          //call api service to push the contract
          this.apiService.removeShift(shiftName).subscribe({
            error: (err: HttpErrorResponse)=> {
              if(err.status === HttpStatusCode.Ok) {
                const index = this.shifts.indexOf(shiftName);
                if (index > -1) {
                  this.shifts.splice(index, 1);
                  this.getShifts();
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

  modifyShift(shiftName: string){
    this.apiService.getShiftByName(shiftName).subscribe({
      next:(shift: ShiftInterface) =>{
        this.openShiftCreationDialog(shift);
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



