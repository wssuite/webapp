import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WEIGHT_ALLOWED_INTEGERS } from 'src/app/constants/regex';
import { dateDisplay } from 'src/app/models/DateDisplay';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { DateUtils } from 'src/app/utils/DateUtils';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { NurseHistoryElement } from 'src/app/models/GenerationRequest';
import { NurseInterface } from 'src/app/models/Nurse';
import { CacheUtils } from 'src/app/utils/CacheUtils';

@Component({
  selector: 'app-nurse-history',
  templateUrl: './nurse-history.component.html',
  styleUrls: ['./nurse-history.component.css']
})
export class NurseHistoryComponent  implements OnInit, OnChanges, OnDestroy{
  regex = WEIGHT_ALLOWED_INTEGERS

  @Input() nurses!: NurseInterface[];
  @Input() startDate!: Date;
  @Output() nursesHistory: EventEmitter<NurseHistoryElement[]>;
  @Output() errorState: EventEmitter<boolean>;
  

  saveHistoryError: boolean;
  timetable: dateDisplay[];
  nurseHistory: Map<string, string>;
  nbColumns: number | undefined;
  possibleShifts!: string[];
  shiftsLoaded: boolean;

 
  constructor(private shiftService: ShiftService,private dialog: MatDialog,  ) {
    this.nursesHistory = new EventEmitter();
    this.errorState = new EventEmitter();
    this.timetable = [];
    this.nurseHistory = new Map();
    this.saveHistoryError = false;
    this.shiftsLoaded = false;

  }

  ngOnChanges(changes: SimpleChanges): void {
    const tempHistory = this.nurseHistory;
    console.log(tempHistory)
    if (changes["nurses"] && changes["nurses"].currentValue) {
      this.nurses = changes["nurses"].currentValue;
    }
    if (changes["startDate"] && changes["startDate"].currentValue) {
      this.startDate = changes["startDate"].currentValue;
      
    }
    //this.ngOnInit()
    this.timetable = []
    this.nbColumns = 7;
    for(let i = 0; i < this.nbColumns; i++) {
      this.timetable.push({date: this.getDateDayStringByIndex(i), day: this.getDayString(i)});
      
    }
    this.timetable.reverse();
    //initiate demands
    this.shiftsLoaded = false
    this.nurseHistory = new Map();
    for(const date of this.timetable){
      for (const nurse of this.nurses) {
          this.nurseHistory.set(JSON.stringify({date:date,nurse:nurse}),"");
      }
    }
    for(const date of this.timetable){
      for(const nurse of this.nurses){
        const history = tempHistory.get(JSON.stringify({date:date, nurse: nurse}))
        console.log(history)
        if(history){
          this.nurseHistory.set(JSON.stringify({date:date, nurse: nurse}), history)
        }
      }
    }
    this.emitNurseHistory()
  }

  ngOnDestroy(): void {
    this.saveHistory()    
  }

  ngOnInit(): void {
    this.timetable = []
    this.nbColumns = 7;
    for(let i = 0; i < this.nbColumns; i++) {
      this.timetable.push({date: this.getDateDayStringByIndex(i), day: this.getDayString(i)});
      
    }
    this.timetable.reverse();
    //initiate demands
    this.shiftsLoaded = false
    this.nurseHistory = new Map();
    console.log(this.nurses)
    for(const date of this.timetable){
      for (const nurse of this.nurses) {
          this.nurseHistory.set(JSON.stringify({date:date,nurse:nurse}),"");
      }
    }
    this.possibleShifts = [];
    try{
      this.shiftService.getShiftNames().subscribe({
        next: (shifts: string[])=>{
          this.possibleShifts = shifts
          this.shiftsLoaded = true;
          const savedHistory = CacheUtils.getNurseHistory()
          if(savedHistory){
            savedHistory.forEach((history: NurseHistoryElement)=>{
              this.timetable.forEach((time: dateDisplay)=>{
                if(history.date === time.date){
                  this.nurses.forEach((n: NurseInterface)=>{
                    if(history.username === n.username){
                      const h = this.nurseHistory.get(JSON.stringify({date: time, nurse: n}))
                      console.log(h)
                      if(h !== undefined){
                        this.nurseHistory.set(JSON.stringify({date: time, nurse: n}), history.shift)
                      }
                    }
                  })
                }
              })
            })
          }
          this.emitNurseHistory()
        },
        error: (error: HttpErrorResponse)=>{
          this.openErrorDialog(error.error);
        }
      })
    }catch(err){
      //Do nothing
    }
  }
  getHistory(date: dateDisplay, nurse: NurseInterface){
    const key = JSON.stringify({date:date,nurse:nurse})
    return this.nurseHistory.get(key)? this.nurseHistory.get(key): ""
  }
  getDateDayStringByIndex(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const previousDay = new Date(
      +this.startDate - (index+1) * DateUtils.dayMultiplicationFactor
    );
    const local_string = previousDay.toISOString().split("T")[0];
    return DateUtils.arrangeDateString(local_string);
  }

  getDayString(index: number): string {
    if (this.startDate == undefined) {
      return "";
    }
    const previousDay = new Date(
      +this.startDate - (index + 1) * DateUtils.dayMultiplicationFactor
    ).getDay();
    return DateUtils.days[previousDay] + "\n";
  }

  onShiftChange(date: dateDisplay, nurse: NurseInterface, shift: string){
    const key = JSON.stringify({date:date,nurse:nurse});
    this.nurseHistory.set(key, shift);
    this.emitNurseHistory();
  }


  emitNurseHistory(){
    const nurseHistory = [];
    for(const date of this.timetable){
      for (const nurse of this.nurses) {
        const key = JSON.stringify({date:date,nurse:nurse});
        const preferenceObj = this.nurseHistory.get(key);
        if(preferenceObj){
          const history = {
            date: date.date,
            username: nurse.username,
            shift: preferenceObj,
          }
          nurseHistory.push(history);
        }
      }
    }
    this.nursesHistory.emit(nurseHistory);
    this.emitErrorState(); 
  }

  getDisplayedDate(date: string){
    try{
      const dateSplitted = date.split("-")
      return `${dateSplitted[1]}/${dateSplitted[2]}`
    }catch(err){
      return ""
    }
  }
  
  @HostListener("window:beforeunload")
  saveHistory(){
    const nurseHistory = [];
    for(const date of this.timetable){
      for (const nurse of this.nurses) {
        const key = JSON.stringify({date:date,nurse:nurse});
        const preferenceObj = this.nurseHistory.get(key);
        if(preferenceObj){
          const history = {
            date: date.date,
            username: nurse.username,
            shift: preferenceObj,
          }
          nurseHistory.push(history);
        }
      }
    }
    CacheUtils.saveNurseHistory(nurseHistory)
  }
  emitErrorState(){
    this.errorState.emit(this.saveHistoryError);
  }


openErrorDialog(message: string) {
  this.dialog.open(ErrorMessageDialogComponent, {
    height: '45%',
    width: '45%', 
    position: {top:'20vh',left: '30%', right: '25%'},
    data: {message: message},
  })
}

}
