import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nurse } from 'src/app/models/Nurse';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent {
  //nurseName: string
  availableContracts: string[]
  //nurseContracts: string[]
  availableSkills: string[]
  //nurseSkills: string[]

  @Input() nurse!: Nurse;
  @Output() nurseChange: EventEmitter<Nurse>;

  constructor(){
    //this.nurseName = "";
    this.availableContracts = ["contract1", "contract2", "contract3", "contract4"]
    //this.nurseContracts = [""]
    //this.nurseSkills = [""]
    this.availableSkills = ["Nurse", "headNurse"]
    this.nurseChange = new EventEmitter<Nurse>()
  }

  public assignContract(contract: string, i: number){
    this.nurse.contracts[i] = contract;
    //console.log(this.nurseContracts);
  }

  public addContract(){
    this.nurse.contracts.push("");
  }

  public removeContract(){
    this.nurse.contracts.pop();
  }

  public addSkill(){
    this.nurse.skills.push("");
  }

  public removeSkill() {
    this.nurse.skills.pop()
  }

  public emitNurse(){
    this.nurseChange.emit(this.nurse);
  }
}
