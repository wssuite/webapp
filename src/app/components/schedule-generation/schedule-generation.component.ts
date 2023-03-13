import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { Router } from "@angular/router";
import { CONSULT_SCHEDULE } from "src/app/constants/app-routes";
import { nurses_example } from "src/app/constants/nurses";
import { NurseInterface } from "src/app/models/Nurse";

@Component({
  selector: "app-schedule-generation",
  templateUrl: "./schedule-generation.component.html",
  styleUrls: ["./schedule-generation.component.css"],
})
export class ScheduleGenerationComponent {
  startDate: Date;
  todayDate: Date;
  range = new FormGroup({
    start: new FormControl(null, Validators.required),
    end: new FormControl(null, Validators.required),
  });
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });
  endDate: Date;

  problemName: string;
  availableNurses: NurseInterface[];
  nurses: NurseInterface[];
  selectedNurse: NurseInterface;
  nursesMap: Map<string, NurseInterface>;

  constructor(private router: Router) {
    this.startDate = new Date();
    this.problemName = "";
    this.endDate = new Date();
    this.todayDate = new Date();
    this.availableNurses = nurses_example;
    this.nurses = [];
    this.selectedNurse = this.availableNurses[0];
    this.nursesMap = new Map();
    this.availableNurses.forEach((nurse: NurseInterface) => {
      this.nursesMap.set(nurse.username, nurse);
    });
  }

  updateStartDate(e: MatDatepickerInputEvent<Date>) {
    this.startDate =
      e.value != null && e.value != undefined
        ? (this.startDate = e.value)
        : (this.startDate = new Date());
  }

  updateEndDate(e: MatDatepickerInputEvent<Date>) {
    this.endDate =
      e.value != null && e.value != undefined
        ? (this.endDate = e.value)
        : (this.endDate = new Date());
  }

  addNurse() {
    console.log(this.selectedNurse);
    const index = this.availableNurses.indexOf(this.selectedNurse);
    if (index > -1) {
      this.availableNurses.splice(index, 1);
    }
    this.nurses.push(this.selectedNurse);
    if (this.availableNurses.length > 0) {
      this.selectedNurse = this.availableNurses[0];
    }
  }

  removeNurse(nurse: NurseInterface) {
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      this.nurses.splice(index, 1);
    }
    const n = this.nursesMap.get(nurse.username);
    if (n !== undefined && n !== null) {
      this.availableNurses.push(n);
    }
  }
  
  removeContract(nurse: NurseInterface, contract: string) {
    const index = this.nurses.indexOf(nurse);
    if (index > -1) {
      const contractIndex = this.nurses[index].contracts.indexOf(contract);
      if (contractIndex > -1) {
        this.nurses[index].contracts.splice(contractIndex, 1);
      }
    }
  }
  viewSchedule() {
    this.router.navigate(["/" + CONSULT_SCHEDULE]);
  }
}
