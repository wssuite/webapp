import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ALL_SOLUTIONS, DETAILED_SOLUTION_URL,
  EXPORT_PROBLEM_URL, GENERATE_SCHEDULE,
  LATEST_SOLUTIONS, 
  REGENERATE_SCHEDULE_URL} from 'src/app/constants/api-constants';
import { GenerationRequest } from 'src/app/models/GenerationRequest';
import { DetailedSchedule, Solution } from 'src/app/models/Schedule';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  
  selectedScheduleToView!: Solution

  constructor(private httpClient: HttpClient) { }

  
  generateSchedule(request: GenerationRequest): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      return this.httpClient.post<HttpResponse<string>>(GENERATE_SCHEDULE, request, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  regenerateSchedule(oldVersion: string,request: GenerationRequest): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append("version", oldVersion);
      return this.httpClient.post<HttpResponse<string>>(REGENERATE_SCHEDULE_URL, request, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  exportProblem(schedule: Solution): Observable<{content: string}> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", schedule.startDate)
      queryParams = queryParams.append("endDate", schedule.endDate)
      queryParams = queryParams.append("version", schedule.version)
      return this.httpClient.get<{content: string}>(EXPORT_PROBLEM_URL, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }

  exportProblemCurrentSchedule(version: string, startDate: string, endDate: string): Observable<{content: string}> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", startDate)
      queryParams = queryParams.append("endDate", endDate)
      queryParams = queryParams.append("version", version)
      return this.httpClient.get<{content: string}>(EXPORT_PROBLEM_URL, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }

  getDetailedSolution(schedule: Solution): Observable<DetailedSchedule>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", schedule.startDate)
      queryParams = queryParams.append("endDate", schedule.endDate)
      queryParams = queryParams.append("version", schedule.version)
      return this.httpClient.get<DetailedSchedule>(DETAILED_SOLUTION_URL, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }

  getAllSolutions():Observable<Solution[]>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      return this.httpClient.get<Solution[]>(ALL_SOLUTIONS, {
        params: queryParams
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  getLatestSolutions(): Observable<Solution[]>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      return this.httpClient.get<Solution[]>(LATEST_SOLUTIONS, {
        params: queryParams
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }
}
