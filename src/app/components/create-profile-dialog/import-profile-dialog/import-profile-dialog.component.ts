/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MAIN_MENU } from 'src/app/constants/app-routes';
import { Contract, ContractInterface } from 'src/app/models/Contract';
import { ContractGroupInterface } from 'src/app/models/ContractGroup';
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
  possibleShiftGroups: string[]
  contractShifts: string[];
  skills: string[];
  contractNames: string[];
  nurses: string[];
  nurseGroups: string[];

  shiftsErrorState: boolean[];
  shiftTypesErrorState: boolean[];
  shiftGroupsErrorState: boolean[];
  contractsErrorState: boolean[];
  nursesErrorState: boolean[];
  nurseGroupsErrorState: boolean[];
  skillsErrorState: boolean[]

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
      this.possibleShiftGroups = []

      this.shiftsErrorState = []
      this.shiftTypesErrorState = []
      this.shiftGroupsErrorState = []
      this.contractsErrorState = []
      this.nursesErrorState = []
      this.nurseGroupsErrorState = []
      this.skillsErrorState = []
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
        this.readArrays();  
        console.log(data)
        this.validProfile = true;
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
      this.contractsErrorState.push(true);
    })
    this.profile.shifts.forEach((shift:ShiftInterface)=>{
      this.possibleShifts.push(shift.name)
      this.contractShifts.push(shift.name)
      this.shiftsErrorState.push(true)
    })
    this.profile.shiftTypes.forEach((st: ShiftTypeInterface)=>{
      this.possibleShiftTypes.push(st.name)
      this.contractShifts.push(st.name)
      this.shiftTypesErrorState.push(true)
    })
    this.profile.shiftGroups.forEach((shiftGroup: ShiftGroupInterface)=>{
      this.possibleShiftGroups.push(shiftGroup.name);
      this.contractShifts.push(shiftGroup.name);
    })
    this.profile.skills.forEach((skill: SkillInterface)=>{
      this.skills.push(skill.name)
      this.skillsErrorState.push(true)
    })
    this.profile.nurses.forEach((nurse: NurseInterface)=>{
      this.nurses.push(nurse.username)
      this.nursesErrorState.push(true)
    })
    this.profile.nurseGroups.forEach((group: NurseGroupInterface)=>{
      this.nurseGroups.push(group.name)
      this.nurseGroupsErrorState.push(true)
    })
    this.profile.shiftGroups.forEach(()=>{
      this.shiftGroupsErrorState.push(true);
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
    this.shiftsErrorState.push(true);
  }

  addShiftGroup(){
    const newSG: ShiftGroupInterface ={
      name:'',
      shifts:[],
      profile: this.profile.profile,
      shiftTypes:[]
    }
    this.profile.shiftGroups.push(newSG)
    this.shiftGroupsErrorState.push(true)
  }

  addShiftType() {
    const newST: ShiftTypeInterface = {
      name:'',
      shifts:[],
      profile: this.profile.profile
    }
    this.profile.shiftTypes.push(newST)
    this.shiftTypesErrorState.push(true);
  }

  addContract() {
    this.contracts.push(new Contract())
    this.contractsErrorState.push(true);
  }

  addNurse() {
    const newNurse: NurseInterface = {
      name:'',
      username:'',
      contracts:[],
      profile: this.profile.profile
    }
    this.profile.nurses.push(newNurse)
    this.nursesErrorState.push(true);
  }

  addNurseGroup() {
    const ng: NurseGroupInterface = {
      name:'',
      contracts:[],
      nurses:[],
      profile: this.profile.profile
    }
    this.profile.nurseGroups.push(ng)
    this.nurseGroupsErrorState.push(true);
  }

  addSkill(){
    const skill: SkillInterface = {
      name:'',
      profile: this.profile.profile
    }
    this.profile.skills.push(skill)
    this.skillsErrorState.push(true)
  }

  removeSkill(index: number){
    this.profile.skills.splice(index, 1);
    this.skillsErrorState.splice(index,1);
  }

  removeShift(index: number){
    this.profile.shifts.splice(index,1);
    this.shiftsErrorState.splice(index,1);
  }

  removeShiftType(index: number){
    this.profile.shiftTypes.splice(index,1);
    this.shiftTypesErrorState.splice(index,1);
  }

  removeShiftGroup(index:number) {
    this.profile.shiftGroups.splice(index,1);
    this.shiftGroupsErrorState.splice(index,1);
  }

  removeNurse(index: number) {
    this.profile.nurses.splice(index,1);
    this.nursesErrorState.splice(index,1);
  }

  removeNurseGroup(index: number) {
    this.profile.nurseGroups.splice(index,1);
    this.nurseGroupsErrorState.splice(index,1);
  }

  removeContract(index:number) {
    this.contracts.splice(index,1);
    this.contractsErrorState.splice(index,1)
  }

  cancel(){
    this.router.navigate(["/" + MAIN_MENU])
  }

  shiftSectionHasError(){
    return this.shiftsErrorState.includes(true)
  }
  shiftHasError(index: number) {
    return this.shiftsErrorState[index]
  }

  shiftTypeSectionHasError(){
    return this.shiftTypesErrorState.includes(true)
  }
  shiftTypeHasError(index:number){
    return this.shiftTypesErrorState[index]
  }

  shiftGroupSectionHasError(){
    return this.shiftGroupsErrorState.includes(true)
  }

  shiftGroupHasError(index: number){
    return this.shiftGroupsErrorState[index]
  }

  contractSectionHasError(){
    return this.contractsErrorState.includes(true)
  }

  contractHasError(index:number){
    return this.contractsErrorState[index]
  }

  nurseSectionHasError(){
    return this.nursesErrorState.includes(true)
  }

  nurseHasError(i:number) {
    return this.nursesErrorState[i]
  }

  nurseGroupSectionHasError() {
    return this.nurseGroupsErrorState.includes(true)
  }

  nurseGroupHasError(i:number) {
    return this.nurseGroupsErrorState[i]
  }

  skillSectionHasError() {
    return this.skillsErrorState.includes(true)
  }

  skillHasError(i:number) {
    return this.skillsErrorState[i];
  }

  formHasError(){
    return this.skillSectionHasError() ||
     this.nurseSectionHasError() || this.nurseGroupSectionHasError()
      || this.contractSectionHasError() || this.shiftGroupSectionHasError()
      || this.shiftSectionHasError() || this.shiftTypeSectionHasError() ||
      this.nameExist() || this.profileNameCtrl.hasError("required") 
  }

  updateShiftErrorState(index:number, e:boolean){
    this.shiftsErrorState[index] = e;
  }

  updateShiftTypeErrorState(index:number, e:boolean){
    this.shiftTypesErrorState[index] = e;
  }

  updateShiftGroupErrorState(index:number, e:boolean){
    this.shiftGroupsErrorState[index] = e;
  }

  updateContractErrorState(index:number, e:boolean){
    this.contractsErrorState[index] = e;
  }

  updateNurseErrorState(index:number, e:boolean){
    this.nursesErrorState[index] = e;
  }

  updateNurseGroupErrorState(index:number, e:boolean){
    this.nurseGroupsErrorState[index] = e;
  }

  updateSkillErrorState(index:number, e:boolean){
    this.skillsErrorState[index] = e;
  }

  saveProfile(){
    const profileContracts: ContractInterface[] = [];
    this.contracts.forEach((contract: Contract)=>{
      profileContracts.push(contract.toJson(this.profile.profile))
    })
    this.profile.shifts.forEach((shift:ShiftInterface)=>{
      shift.profile = this.profile.profile;
    })
    this.profile.shiftTypes.forEach((shiftType: ShiftTypeInterface)=>{
      shiftType.profile = this.profile.profile
    })
    this.profile.shiftGroups.forEach((sg: ShiftGroupInterface)=>{
      sg.profile = this.profile.profile
    })
    this.profile.nurseGroups.forEach((ng: NurseGroupInterface)=>{
      ng.profile = this.profile.profile
    })
    this.profile.nurses.forEach((n: NurseInterface)=>{
      n.profile = this.profile.profile
    })
    this.profile.skills.forEach((s: SkillInterface)=>{
      s.profile = this.profile.profile
    })
    this.profile.contracts = profileContracts;
    this.profile.contractGroups.forEach((cg: ContractGroupInterface)=>{
      cg.profile = this.profile.profile
    })
    this.profileService.save(this.profile).subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.profileService.emitNewProfileCreation();
          this.router.navigate(["/" + MAIN_MENU])
        }
        else{
          this.profileService.deleteProfileByName(this.profile.profile)
          this.openErrorDialog(err.error)
        }
      }
    })
  }
}
