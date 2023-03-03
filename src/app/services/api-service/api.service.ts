import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  ADD_CONTRACT_URL,
  FETCH_SHIFT_GROUP_NAMES,
  FETCH_SHIFT_NAMES,
  FETCH_SHIFT_TYPE_NAMES,
  PROTOTYPE_SCHEDULE_URL,
  TEST_URL,
} from "src/app/constants/api-constants";
import { EmployeeSchedule } from "src/app/models/Assignment";
import { ContractInterface } from "src/app/models/Contract";

@Injectable({
  providedIn: "root",
})
export class APIService {
  constructor(private httpClient: HttpClient) {}

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
