import { Component } from '@angular/core';

@Component({
  selector: 'app-nurse',
  templateUrl: './nurse.component.html',
  styleUrls: ['./nurse.component.css']
})
export class NurseComponent {
  nurseName: string
  availableContracts: string[]
  nurseContracts: string[]
  availableSkills: string[]
  nurseSkills: string[]

  constructor(){
    this.nurseName = "";
    this.availableContracts = ["contract1", "contract2", "contract3", "contract4"]
    this.nurseContracts = [""]
    this.nurseSkills = [""]
    this.availableSkills = ["Nurse", "headNurse"]
  }

  public assignContract(contract: string, i: number){
    this.nurseContracts[i] = contract;
    console.log(this.nurseContracts);
  }

  public addContract(){
    this.nurseContracts.push("");
  }

  public removeContract(){
    this.nurseContracts.pop();
  }

  public addSkill(){
    this.nurseSkills.push("");
  }

  public removeSkill() {
    this.nurseSkills.pop()
  }

}
