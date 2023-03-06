import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ADD_ACCOUNT_URL,
  GET_USERNAMES,
  LOGIN_URL,
  LOGOUT_URL,
  PROTOTYPE_SCHEDULE_URL,
  TEST_URL,
} from "src/app/constants/api-constants";
import { AccountInterface } from "src/app/models/Account";
import { EmployeeSchedule } from "src/app/models/Assignment";
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
      console.log("queryparam", queryParams)
      return this.httpClient.post<HttpResponse<string>>(LOGOUT_URL, null, {
        params: queryParams
      });
    } catch(err){
      console.log("error api");
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

  getAccountsUsername(): Observable<string[]> {
    try {
      console.log("call api step 1");
      let queryParams = new HttpParams();
      console.log("call api step 2");
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      console.log("call api step 3");
      return this.httpClient.get<string[]>(GET_USERNAMES, {
        params: queryParams,
      });
    }catch(err){
      console.log("error api");
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

  //addAccount(account: Account): Observable<HttpResponse<string>> {
    //return this.httpClient.post<HttpResponse<string>>(ADD_ACCOUNT_URL, account);
  //}
}
