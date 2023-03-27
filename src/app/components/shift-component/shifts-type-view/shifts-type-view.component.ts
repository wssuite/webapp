import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ShiftTypeService } from 'src/app/services/shift/shift-type.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { ShiftTypeCreationDialogComponent } from '../shift-type-creation-dialog/shift-type-creation-dialog.component';


@Component({
  selector: 'app-shifts-type-view',
  templateUrl: './shifts-type-view.component.html',
  styleUrls: ['./shifts-type-view.component.css']
})
export class ShiftsTypeViewComponent implements OnInit, AfterViewInit{
  
  shiftsType: string[];
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<ShiftTypeInterface>;

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

  constructor(private dialog: MatDialog, private shiftTypeService: ShiftTypeService,
     private profileService: ProfileService) {
    this.shiftsType = [];
    this.displayedColumns =  ['name', 'shifts','actions'];
    this.dataSource = new MatTableDataSource();

  }
  ngOnInit(): void {
    try{
      this.getShiftsType();
      this.connectedUser = true;
    }catch(err){
      this.connectedUser = false;
    }
  }

  ngAfterViewInit(): void {
      this.profileService.profileChanged.subscribe(()=>{
        this.getShiftsType();
      })
  }

  getShiftsType(){
    this.shiftTypeService.getShiftTypeNames().subscribe({
      next: (shiftsType: string[])=> {
      this.shiftsType = shiftsType;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    this.shiftTypeService.getAllShiftType().subscribe({
      next: (shiftType: ShiftTypeInterface[])=> {
        this.dataSource.data = shiftType;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })
    
  }

  openShiftTypeCreationDialog(shiftType: ShiftTypeInterface) {
    const dialog = this.dialog.open(ShiftTypeCreationDialogComponent,  
      { disableClose: true,  
        height: '85%',
        width: '55%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {shiftType:shiftType, shiftsType:this.shiftsType}
      });

      dialog.afterClosed().subscribe(()=>{
        this. getShiftsType();
      })
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  createNewShiftType(){
    const newShiftType = {name: '', shifts: [], profile: CacheUtils.getProfile()};
    this.openShiftTypeCreationDialog(newShiftType); 
  }

  deleteShiftType(shiftTypeName: string){
    try
    { 
      //call api service to push the contract
      this.shiftTypeService.removeShiftType(shiftTypeName).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            const index = this.shiftsType.indexOf(shiftTypeName);
            if (index > -1) {
              this.shiftsType.splice(index, 1);
              this.getShiftsType();
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

  modifyShiftType(shiftTypeName: string){
    this.shiftTypeService.getShiftTypeByName(shiftTypeName).subscribe({
      next:(shiftType: ShiftTypeInterface) =>{
        this.openShiftTypeCreationDialog(shiftType);
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
