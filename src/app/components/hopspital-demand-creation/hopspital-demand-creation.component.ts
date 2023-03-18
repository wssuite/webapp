import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateFilterFn } from '@angular/material/datepicker';


@Component({
  selector: 'app-hopspital-demand-creation',
  templateUrl: './hopspital-demand-creation.component.html',
  styleUrls: ['./hopspital-demand-creation.component.css']
})
export class HopspitalDemandCreationComponent {

  selected!: Date | null;
  

  dateFilter: DateFilterFn<Date> =  (d: Date | null): boolean => {
    const date = (d || new Date()).getDate()
    const month = (d || new Date()).getMonth()
    const year = (d || new Date()).getFullYear()
    // Prevent Saturday and Sunday from being selected.
    return date >= 9 && date <= 20;
  };


}
