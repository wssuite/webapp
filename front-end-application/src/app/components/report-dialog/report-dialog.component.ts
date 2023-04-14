import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContinuousVisualisationInterface } from 'src/app/models/Schedule';
import { ScheduleService } from 'src/app/services/schedule/schedule-service.service';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent implements OnInit{

  statistics: string[][]
  reportExample: Map<string, string>

  constructor(public dailogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContinuousVisualisationInterface,
    private service: ScheduleService){
      this.statistics = []
      this.reportExample = new Map()
    }

  ngOnInit(): void {
    this.service.getResport(this.data).subscribe({
      next: (report: Map<string, string>)=>{
        console.log(report)
        for(const [key, value] of Object.entries(report)){
          this.reportExample.set(key, value)
        }
        this.reportExample.forEach((value: string, key: string)=>{
          const line = [key, value]
          this.statistics.push(line)
        })
      }
    })
  }

}
