/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MAIN_MENU } from 'src/app/constants/app-routes';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { NurseGroupInterface, NurseInterface } from 'src/app/models/Nurse';
import { BaseProfile, DetailedProfile } from 'src/app/models/Profile';
import { ShiftInterface, ShiftTypeInterface, ShiftGroupInterface } from 'src/app/models/Shift';
import { SkillInterface } from 'src/app/models/skill';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-import-profile-dialog',
  templateUrl: './import-profile-dialog.component.html',
  styleUrls: ['./import-profile-dialog.component.css']
})
export class ImportProfileComponent implements OnInit{

  fileName: string;
  profile!: DetailedProfile;
  validProfile: boolean;
  profileNames: string[]
  connectedUser: boolean;
  profileNameCtrl: FormControl;
  contracts: Contract[];
  possibleShifts: string[];
  possibleShiftTypes: string[];
  contractShifts: string[];
  skills: string[];
  contractNames: string[];
  nurses: string[];
  nurseGroups: string[];

  constructor( private profileService: ProfileService,
    private dialog: MatDialog, private router: Router,
     private contractService: ContractService){
      this.fileName = '';
      this.validProfile = false;
      this.profileNames = [];
      this.connectedUser = false;
      this.profileNameCtrl = new FormControl(null, Validators.required)
      this.contracts = [];
      this.possibleShifts = []
      this.possibleShiftTypes = []
      this.contractShifts = []
      this.skills = []
      this.contractNames = []
      this.nurses = []
      this.nurseGroups = []
    }

  ngOnInit(): void {
    this.profileNames = []
    try{
      this.profileService.getAllProfiles().subscribe({
        next: (profiles: BaseProfile[])=>{
          profiles.forEach((p: BaseProfile)=>{
            this.profileNames.push(p.profile)
          })
          console.log(this.profileNames)
        },
        error: (err: HttpErrorResponse)=>{
          this.openErrorDialog(err.error)
        }
      })
      this.connectedUser = true;
    } catch(err){
      this.connectedUser = false;
    }
  }

  onFileSelected(event:any){
    console.log("here")
    const file: File = event.target.files[0];
    this.fileName = file.name;
    const formData = new FormData();
    formData.append("file", file);
    this.profileService.import(formData).subscribe({
      next: (data: DetailedProfile)=> {
        this.profile = data
        this.validProfile = true;
        this.readArrays();  
        console.log(data)
      },
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.router.navigate(["/" + MAIN_MENU])
        }
        else{
          this.openErrorDialog(err.error);
        }
      }
    })
  }
  
  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      data:{message: message}
    })
  }

  nameExist(): boolean{
    if(this.profileNames === undefined){
      return false
    }
    return this.profileNames.includes(this.profile.profile)
  }

  readArrays(){
    this.profile.contracts.forEach((c:ContractInterface)=>{
      this.contracts.push(this.contractService.fromJson(c))
      this.contractNames.push(c.name);
    })
    console.log(this.contracts)
    this.profile.shifts.forEach((shift:ShiftInterface)=>{
      this.possibleShifts.push(shift.name)
      this.contractShifts.push(shift.name)
    })
    this.profile.shiftTypes.forEach((st: ShiftTypeInterface)=>{
      this.possibleShiftTypes.push(st.name)
      this.contractShifts.push(st.name)
    })
    this.profile.skills.forEach((skill: SkillInterface)=>{
      this.skills.push(skill.name)
    })
    this.profile.nurses.forEach((nurse: NurseInterface)=>{
      this.nurses.push(nurse.username)
    })
    this.profile.nurseGroups.forEach((group: NurseGroupInterface)=>{
      this.nurseGroups.push(group.name)
    })
  }

  addShift(){
    const newShift: ShiftInterface = {
      startTime:'',
      endTime:'',
      name:'',
      profile: this.profile.profile,
    }
    this.profile.shifts.push(newShift)
  }

  addShiftGroup(){
    const newSG: ShiftGroupInterface ={
      name:'',
      shifts:[],
      profile: this.profile.profile,
      shiftTypes:[]
    }
    this.profile.shiftGroups.push(newSG)
  }

  addShiftType() {
    const newST: ShiftTypeInterface = {
      name:'',
      shifts:[],
      profile: this.profile.profile
    }
    this.profile.shiftTypes.push(newST)
  }

  addContract() {
    this.contracts.push(new Contract())
  }

  addNurse() {
    const newNurse: NurseInterface = {
      name:'',
      username:'',
      contracts:[],
      profile: this.profile.profile
    }
    this.profile.nurses.push(newNurse)
  }

  addNurseGroup() {
    const ng: NurseGroupInterface = {
      name:'',
      contracts:[],
      nurses:[],
      profile: this.profile.profile
    }
    this.profile.nurseGroups.push(ng)
  }

  addSkill(){
    const skill: SkillInterface = {
      name:'',
      profile: this.profile.profile
    }
    this.profile.skills.push(skill)
  }

  removeSkill(index: number){
    this.profile.skills.splice(index, 1);
  }

  removeShift(index: number){
    this.profile.shifts.splice(index,1);
  }

  removeShiftType(index: number){
    this.profile.shiftTypes.splice(index,1);
  }

  removeShiftGroup(index:number) {
    this.profile.shiftGroups.splice(index,1);
  }

  removeNurse(index: number) {
    this.profile.nurses.splice(index,1);
  }

  removeNurseGroup(index: number) {
    this.profile.nurseGroups.splice(index,1);
  }

  removeContract(index:number) {
    this.contracts.splice(index,1);
  }

  cancel(){
    this.router.navigate(["/" + MAIN_MENU])
  }
}
