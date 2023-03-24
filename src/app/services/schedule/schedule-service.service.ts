import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ALL_SOLUTIONS, DETAILED_SOLUTION_URL,
  EXPORT_PROBLEM_URL, GENERATE_SCHEDULE,
  LATEST_SOLUTIONS } from 'src/app/constants/api-constants';
import { Schedule } from 'src/app/models/Schedule';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private httpClient: HttpClient) { }

  // TODO: Modify
  generateSchedule(){
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      return this.httpClient.post(GENERATE_SCHEDULE, null, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  exportProblem(schedule: Schedule): Observable<{content: string}> {
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
  // TODO: Modify
  getDetailedSolution(schedule: Schedule){
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", schedule.startDate)
      queryParams = queryParams.append("endDate", schedule.endDate)
      queryParams = queryParams.append("version", schedule.version)
      return this.httpClient.get(DETAILED_SOLUTION_URL, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }

  getAllSolutions():Observable<Schedule[]>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      return this.httpClient.get<Schedule[]>(ALL_SOLUTIONS, {
        params: queryParams
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  getLatestSolutions(): Observable<Schedule[]>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      return this.httpClient.get<Schedule[]>(LATEST_SOLUTIONS, {
        params: queryParams
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }
}
