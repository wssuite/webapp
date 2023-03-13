import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ADD_SHIFT_GROUP_URL,
  ADD_SHIFT_TYPE_URL,
  ADD_SHIFT_URL,
  FETCH_SHIFT_BY_NAMES,
  FETCH_SHIFT_GROUP_BY_NAMES,
  ADD_ACCOUNT_URL,
  DELETE_ACCOUNT_URL,
  GET_USERNAMES,
  FETCH_SHIFT_GROUP_NAMES,
  FETCH_SHIFT_NAMES,
  FETCH_SHIFT_TYPE_BY_NAMES,
  ADD_CONTRACT_URL,
  FETCH_SHIFT_TYPE_NAMES,
  FETCH_SKILLS,
  LOGIN_URL,
  LOGOUT_URL,
  PROTOTYPE_SCHEDULE_URL,
  REMOVE_SHIFT_GROUP_URL,
  REMOVE_SHIFT_TYPE_URL,
  REMOVE_SHIFT_URL,
  TEST_URL,
  UPDATE_SHIFT_URL,
  UPDATE_SHIFT_TYPE_URL,
  UPDATE_SHIFT_GROUP_URL,
  FETCH_CONTRACT_NAMES,
  ADD_NURSE_URL,
  FETCH_ALL_NURSE_USERNAME,
  REMOVE_NURSE_URL,
  UPDATE_NURSE_URL,
  FETCH_NURSE_BY_USERNAME,
  FETCH_NURSE_URL,
  ADD_NURSE_GROUP_URL,
  REMOVE_NURSE_GROUP_URL,
  UPDATE_NURSE_GROUP_URL,
  FETCH_NURSE_GROUP_BY_NAME,
  FETCH_NURSE_GROUP_URL,
  FETCH_ALL_NURSE_GROUP_NAME,
} from "src/app/constants/api-constants";
import { EmployeeSchedule } from "src/app/models/Assignment";
import { ContractInterface } from "src/app/models/Contract";
import { Credentials, UserInfo } from "src/app/models/Credentials";
import { NurseGroupInterface, NurseInterface } from "src/app/models/Nurse";
import { ShiftGroupInterface, ShiftInterface, ShiftTypeInterface } from "src/app/models/Shift";
import { CacheUtils, TOKEN_STRING } from "src/app/utils/CacheUtils";
import { Exception } from "src/app/utils/Exception";

@Injectable({
  providedIn: "root",
})
export class APIService {

  constructor(private httpClient: HttpClient) {}

  login(credentials:Credentials): Observable<UserInfo> {
    return this.httpClient.post<UserInfo>(LOGIN_URL, credentials);
  }

  logout():Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(LOGOUT_URL, null, {
        params: queryParams
      });
    } catch(err){
      throw new Exception("user not logged in")
    }
  }

  test(): Observable<string> {
    return this.httpClient.get<string>(TEST_URL);
  }

  getPrototypeSchedule(): Observable<EmployeeSchedule> {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("version", 1);
    return this.httpClient.get<EmployeeSchedule>(PROTOTYPE_SCHEDULE_URL, {
      params: queryParams,
    });
  }

  addShift(shift: ShiftInterface):Observable<HttpResponse<string>>{
    try{
      console.log("addShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_SHIFT_URL, shift, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }
  
  getAccountsUsername(): Observable<string[]> {
    try {
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(GET_USERNAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Error("user not logged in")
    }
  }
  addAccount(account: Credentials):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_ACCOUNT_URL, account, {
        params: queryParams,
      });
    }catch(err){
      throw new Error("user not logged in");
    }
  }

  deleteAccount(account: string){
    try {
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("username", account);
      return this.httpClient.delete<string>(DELETE_ACCOUNT_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Error("user not logged in")
    }
  }

  addContract(contract: ContractInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_CONTRACT_URL, contract, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeShift(shift_name: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shift_name);
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_SHIFT_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateShift(shift: ShiftInterface):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.put<HttpResponse<string>>(UPDATE_SHIFT_URL, shift,{params: queryParams});
    }catch(err){
      throw new Exception("user not logged in");
    }
    
  }

  addShiftType(shiftType: ShiftTypeInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_SHIFT_TYPE_URL, shiftType, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeShiftType(shiftType_name: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shiftType_name);
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_SHIFT_TYPE_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateShiftType(shiftType: ShiftTypeInterface):Observable<HttpResponse<string>> {
    return this.httpClient.put<HttpResponse<string>>(UPDATE_SHIFT_TYPE_URL, shiftType);
  }

  addShiftGroup(shiftGroup: ShiftGroupInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_SHIFT_GROUP_URL, shiftGroup, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeShiftGroup(shiftGroup_name: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shiftGroup_name);
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_SHIFT_GROUP_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateShiftGroup(shiftType: ShiftTypeInterface):Observable<HttpResponse<string>> {
    return this.httpClient.put<HttpResponse<string>>(UPDATE_SHIFT_GROUP_URL, shiftType);
  }

  getShiftNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_SHIFT_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getShiftByName(shift_name: string):Observable<ShiftInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shift_name);
      return this.httpClient.get<ShiftInterface>(FETCH_SHIFT_BY_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getShiftGroupNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_SHIFT_GROUP_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getShiftGroupByName(shiftGroup_name: string):Observable<ShiftGroupInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shiftGroup_name);
      return this.httpClient.get<ShiftGroupInterface[]>(FETCH_SHIFT_GROUP_BY_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getShiftTypeNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_SHIFT_TYPE_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getShiftTypeByName(shiftType_name: string):Observable<ShiftTypeInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shiftType_name);
      return this.httpClient.get<ShiftTypeInterface[]>(FETCH_SHIFT_TYPE_BY_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }


  getContractNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_CONTRACT_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getAllSkills(): Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_SKILLS, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  addNurse(nurse: NurseInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_NURSE_URL, nurse, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeNurse(nurse_username: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("username", nurse_username);
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_NURSE_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getAllNurseUsername(): Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_ALL_NURSE_USERNAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateNurse(nurse: NurseInterface):Observable<HttpResponse<string>> {
    return this.httpClient.put<HttpResponse<string>>(UPDATE_NURSE_URL, nurse);
  }

  getNurseByUserName(nurse_username: string):Observable<NurseInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("username", nurse_username);
      return this.httpClient.get<NurseInterface>(FETCH_NURSE_BY_USERNAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getAllNurse(): Observable<NurseInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<NurseInterface[]>(FETCH_NURSE_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

    addNurseGroup(nurseGroup: NurseGroupInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_NURSE_GROUP_URL, nurseGroup, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeNurseGroup(nurseGroup_name: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", nurseGroup_name);
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_NURSE_GROUP_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }


  updateNurseGroup(nurseGroup: NurseGroupInterface):Observable<HttpResponse<string>> {
    return this.httpClient.put<HttpResponse<string>>(UPDATE_NURSE_GROUP_URL, nurseGroup);
  }

  getNurseGroupByName(nurseGroup_name: string):Observable<NurseGroupInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", nurseGroup_name);
      return this.httpClient.get<NurseGroupInterface>(FETCH_NURSE_GROUP_BY_NAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getAllNurseGroup(): Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_NURSE_GROUP_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getAllNurseGroupName(): Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<string[]>(FETCH_ALL_NURSE_GROUP_NAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }
}
