import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ADD_SHIFT_GROUP_URL,
  ADD_SHIFT_TYPE_URL,
  ADD_SHIFT_URL,
  FETCH_SHIFT_GROUP_NAMES,
  FETCH_SHIFT_NAMES,
  FETCH_SHIFT_TYPE_NAMES,
  LOGIN_URL,
  LOGOUT_URL,
  PROTOTYPE_SCHEDULE_URL,
  TEST_URL,
} from "src/app/constants/api-constants";
import { EmployeeSchedule } from "src/app/models/Assignment";
import { Credentials, UserInfo } from "src/app/models/Credentials";
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
      throw new Error("user not logged in")
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
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_SHIFT_URL, shift, {
        params: queryParams,
      });
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

}
