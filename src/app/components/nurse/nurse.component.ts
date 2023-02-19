import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Nurse } from "src/app/models/Nurse";

@Component({
  selector: "app-nurse",
  templateUrl: "./nurse.component.html",
  styleUrls: ["./nurse.component.css"],
})
export class NurseComponent {
  availableContracts: string[];
  availableSkills: string[];

  @Input() nurse!: Nurse;
  @Output() nurseChange: EventEmitter<Nurse>;

  constructor() {
    this.availableContracts = [
      "contract1",
      "contract2",
      "contract3",
      "contract4",
    ];
    this.availableSkills = ["Nurse", "headNurse"];
    this.nurseChange = new EventEmitter<Nurse>();
  }

  public assignContract(contract: string, i: number) {
    this.nurse.contracts[i] = contract;
  }

  public addContract() {
    this.nurse.contracts.push("");
  }

  public removeContract() {
    this.nurse.contracts.pop();
  }

  public emitNurse() {
    this.nurseChange.emit(this.nurse);
  }
}
