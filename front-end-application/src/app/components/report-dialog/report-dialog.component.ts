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
  /*reportExample = "status:OPTIMAL\n"+
  "cost:400\n"+
  "runTime:0.078255\n"+
  "TotalCostUnderstaffing:-1\n"*/

  constructor(public dailogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContinuousVisualisationInterface,
    private service: ScheduleService){
      this.statistics = []
      this.reportExample = new Map()
      this.reportExample.set("status", "Optimal")
      this.reportExample.set("cost", "400")
      this.reportExample.set("runTime", "0.078255")
      this.reportExample.set("TotalCostUnderstaffing","-1")
    }

  ngOnInit(): void {
    // call endpoint
    this.reportExample.forEach((value: string, key: string)=>{
      const line = [key, value]
      this.statistics.push(line)
    })
  }

}
