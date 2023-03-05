import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import {
  LOGIN_URL,
  PROTOTYPE_SCHEDULE_URL,
  TEST_URL,
} from "src/app/constants/api-constants";
import { EmployeeSchedule } from "src/app/models/Assignment";
import { Credentials, UserInfo } from "src/app/models/Credentials";

@Injectable({
  providedIn: "root",
})
export class APIService {

  userInfo: Subject<UserInfo>;
  $userInfo: Observable<UserInfo>;

  constructor(private httpClient: HttpClient) {
    this.userInfo = new Subject();
    this.$userInfo = this.userInfo.asObservable();
  }

  login(credentials:Credentials): Observable<UserInfo> {
    return this.httpClient.post<UserInfo>(LOGIN_URL, credentials);
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
}
