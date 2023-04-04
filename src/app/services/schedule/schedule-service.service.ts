import { HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Socket, io} from "socket.io-client";
import { ALL_SOLUTIONS, BASE_URL, DETAILED_SOLUTION_URL,
  EXPORT_PROBLEM_URL, EXPORT_SOLUTION_URL, GENERATE_SCHEDULE,
  LATEST_SOLUTIONS, 
  REGENERATE_SCHEDULE_URL,REMOVE_SOLUTION, STOP_GENERATION_URL} from 'src/app/constants/api-constants';
import { SUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, UNSUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, VISUALISATION_SUBSCRIPTION, VISUALISATION_UNSUBSCRIPTION } from 'src/app/constants/socket-events';
import { GenerationRequest } from 'src/app/models/GenerationRequest';
import { ContinuousVisualisationInterface, DetailedSchedule, Solution } from 'src/app/models/Schedule';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  
  selectedScheduleToView!: Solution
  socket!: Socket;

  constructor(private httpClient: HttpClient) { 
    this.socket = io(BASE_URL)
    const notifSubscriptions = CacheUtils.getNotifSubscriptions()
    for(const sub of notifSubscriptions){
      this.notificationSubscribe(sub);
    }
    const savedVisulaisation = CacheUtils.getContinuousVisulaisation()
    if(savedVisulaisation){
      this.subscribeContinuousVisulation(savedVisulaisation)
    }
    console.log(this.socket)
  }

  
  generateSchedule(request: GenerationRequest): Observable<Solution>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      return this.httpClient.post<Solution>(GENERATE_SCHEDULE, request, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  regenerateSchedule(oldVersion: string,request: GenerationRequest): Observable<Solution>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append("version", oldVersion);
      return this.httpClient.post<Solution>(REGENERATE_SCHEDULE_URL, request, {
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

  removeSolution(sol: Solution): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", sol.startDate)
      queryParams = queryParams.append("endDate", sol.endDate)
      queryParams = queryParams.append("version", sol.version)
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_SOLUTION, {
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

  stopGeneration(sol: ContinuousVisualisationInterface): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      return this.httpClient.post<HttpResponse<string>>(STOP_GENERATION_URL, sol,{
        params: queryParams
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  exportSolution(sol: ContinuousVisualisationInterface): Observable<{content: string}>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", sol.startDate)
      queryParams = queryParams.append("endDate", sol.endDate)
      queryParams = queryParams.append("version", sol.version)
      return this.httpClient.get<{content: string}>(EXPORT_SOLUTION_URL, {
        params: queryParams
      })
    } catch(err){
      throw new Error("user not connected")
    }
  }

  connectSocket(){
    this.socket = io(BASE_URL)
    console.log(this.socket)
  }

  disconnectSocket(){
    this.socket.disconnect()
  }

  notificationUnsubscribe(solution: ContinuousVisualisationInterface){
    this.socket.emit(UNSUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, solution)
  }

  notificationSubscribe(solution: ContinuousVisualisationInterface) {
    this.socket.emit(SUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, solution)
  }

  subscribeContinuousVisulation(solution: ContinuousVisualisationInterface ){
    this.socket.emit(VISUALISATION_SUBSCRIPTION, solution)
    CacheUtils.setContinuousVisualisation(solution)
  }
  unsubscribeContinuousVisulation(solution: ContinuousVisualisationInterface) {
    this.socket.emit(VISUALISATION_UNSUBSCRIPTION, solution)
    try{
      CacheUtils.clearContinuousVisulaisation()
    } catch(err){
      // Do nothing
    }
  }
}
