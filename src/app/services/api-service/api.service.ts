import { HttpClient, HttpParams} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  PROTOTYPE_SCHEDULE_URL,
  TEST_URL,
} from "src/app/constants/api-constants";
import { EmployeeSchedule } from "src/app/models/Assignment";



@Injectable({
  providedIn: "root",
})
export class APIService {

  constructor(private httpClient: HttpClient) {}
  
  // prototypoe section
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
