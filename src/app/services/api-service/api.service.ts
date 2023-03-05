import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ADD_CONTRACT_URL,
  FETCH_SHIFT_GROUP_NAMES,
  FETCH_SHIFT_NAMES,
  FETCH_SHIFT_TYPE_NAMES,
  LOGIN_URL,
  LOGOUT_URL,
  PROTOTYPE_SCHEDULE_URL,
  TEST_URL,
} from "src/app/constants/api-constants";
import { EmployeeSchedule } from "src/app/models/Assignment";
import { ContractInterface } from "src/app/models/Contract";
import { Credentials, UserInfo } from "src/app/models/Credentials";
import { CacheUtils, TOKEN_STRING } from "src/app/utils/CacheUtils";

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

  addContract(contract: ContractInterface):Observable<HttpResponse<string>>{
    return this.httpClient.post<HttpResponse<string>>(ADD_CONTRACT_URL, contract);
  }

  getShiftNames():Observable<string[]> {
    return this.httpClient.get<string[]>(FETCH_SHIFT_NAMES);
  }

  getShiftGroupNames():Observable<string[]> {
    return this.httpClient.get<string[]>(FETCH_SHIFT_GROUP_NAMES);
  }

  getShiftTypeNames():Observable<string[]> {
    return this.httpClient.get<string[]>(FETCH_SHIFT_TYPE_NAMES);
  }
}
