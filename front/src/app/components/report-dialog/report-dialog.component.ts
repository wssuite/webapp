import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ContinuousVisualisationInterface } from 'src/app/models/Schedule';
import { ScheduleService } from 'src/app/services/schedule/schedule-service.service';

interface StatisticElement {
  name: string;
  value: string;

}
@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.css']
})
export class ReportDialogComponent implements OnInit{
  dataSource: MatTableDataSource<StatisticElement>;
  displayedColumns: string[]

  constructor(public dailogRef: MatDialogRef<ReportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ContinuousVisualisationInterface,
    private service: ScheduleService){
      this.dataSource = new MatTableDataSource()
      this.displayedColumns = ["name", "value"]
    }

  ngOnInit(): void {
    this.service.getReport(this.data).subscribe({
      next: (report: Map<string, string>)=>{
        const statistics: StatisticElement[] = []
        for(const [key, value] of Object.entries(report)){
          statistics.push({name:key, value: value});
        }
        this.dataSource.data = statistics
      }
    })
  }

}
