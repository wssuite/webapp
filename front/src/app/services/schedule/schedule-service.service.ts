import { HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import {Socket, io} from "socket.io-client";
import { ALL_SOLUTIONS, DETAILED_SOLUTION_URL,
  EXPORT_PROBLEM_URL, EXPORT_SOLUTION_URL, EXPRORT_ERROR_URL, GENERATE_SCHEDULE,
  GET_STATISTIC_URL,
  LATEST_SOLUTIONS,
  REGENERATE_SCHEDULE_URL,
  IMPORT_SOLUTION_URL, REMOVE_SOLUTION, STOP_GENERATION_URL} from 'src/app/constants/api-constants';
import { SUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, UNSUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, VISUALISATION_SUBSCRIPTION, VISUALISATION_UNSUBSCRIPTION } from 'src/app/constants/socket-events';
import { GenerationRequest } from 'src/app/models/GenerationRequest';
import { ContinuousVisualisationInterface, DetailedSchedule, Solution } from 'src/app/models/Schedule';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  selectedScheduleToView!: Solution
  importedScheduleToView!: boolean
  socket!: Socket;
  socketConnected: Subject<boolean>;
  notificationsSubscriptions: ContinuousVisualisationInterface[];
  visualisationSubscription: ContinuousVisualisationInterface | undefined;

  constructor(private httpClient: HttpClient) {
    this.notificationsSubscriptions = [];
    this.visualisationSubscription = undefined;
    this.socketConnected = new Subject();
    this.socket = io()
    this.socket.on('connect', () => {
      console.log("Socket is connected");
      this.joinSubscriptions();
      this.socketConnected.next(true);
    });
    this.socket.on('reconnect', () => {
      console.log("Socket is reconnected");
      this.joinSubscriptions();
      this.socketConnected.next(true);
    });
    this.socket.on('disconnect', () => {
      console.log("Socket is disconnected");
    });
    this.socket.on('join_room', (data) => {
      console.log('join room '+data.room+" at "+data.at)
    });
    this.socket.on('leave_room', (data) => {
      console.log('leave room '+data.room+" at "+data.at)
    });
  }

  joinSubscriptions() {
    for(const sub of this.notificationsSubscriptions){
      this.socketEmit(SUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, sub)
    }
    if(this.visualisationSubscription){
      this.socketEmit(VISUALISATION_SUBSCRIPTION, this.visualisationSubscription)
    }
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

  importSolution(file: File): Observable<Solution>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      const formData = new FormData();
      formData.append("file", file);
      return this.httpClient.post<Solution>(IMPORT_SOLUTION_URL, formData, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in")
    }
  }

  exportProblemSchedule(schedule: Solution, format: string = "txt"): Observable<{content: string}> {
    return this.exportProblem(schedule.version, schedule.startDate, schedule.endDate, format);
  }

  exportProblem(version: string, startDate: string, endDate: string, format: string = "txt"): Observable<{content: string}> {
    try{
      console.log("exportProblem format: " + format);
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", startDate)
      queryParams = queryParams.append("endDate", endDate)
      queryParams = queryParams.append("version", version)
      queryParams = queryParams.append("format", format)
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
      queryParams = queryParams.append(PROFILE_STRING, sol.profile || CacheUtils.getProfile())
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
      queryParams = queryParams.append(PROFILE_STRING, schedule.profile || CacheUtils.getProfile())
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
      queryParams = queryParams.append(PROFILE_STRING, sol.profile || CacheUtils.getProfile())
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

  exportError(sol: ContinuousVisualisationInterface):Observable<{content: string}>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", sol.startDate)
      queryParams = queryParams.append("endDate", sol.endDate)
      queryParams = queryParams.append("version", sol.version)
      return this.httpClient.get<{content: string}>(EXPRORT_ERROR_URL, {
        params: queryParams
      })
    } catch(err){
      throw new Error("user not connected")
    }
  }

  getReport(sol: ContinuousVisualisationInterface):Observable<Map<string, string>>{
    try{
      let queryParams = new HttpParams;
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken())
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile())
      queryParams = queryParams.append("startDate", sol.startDate)
      queryParams = queryParams.append("endDate", sol.endDate)
      queryParams = queryParams.append("version", sol.version)
      return this.httpClient.get<Map<string, string>>(GET_STATISTIC_URL, {
        params: queryParams
      })
    } catch(err){
      throw new Error("user not connected")
    }
  }

  disconnectSocket(){
    this.socket.disconnect()
  }

  isConnected(){
    if(this.socket.connected) {
      this.socketConnected.next(true);
    }
  }

  notificationUnsubscribe(solution: ContinuousVisualisationInterface){
    const index = this.notificationsSubscriptions.indexOf(solution)
    if(index > -1){
        this.notificationsSubscriptions.splice(index, 1);
        this.socketEmit(UNSUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, solution);
    }
  }

  notificationSubscribe(solution: ContinuousVisualisationInterface) {
    const index = this.notificationsSubscriptions.indexOf(solution)
    if(index == -1){
        this.notificationsSubscriptions.push(solution);
        this.socketEmit(SUBSCRIBE_SCHEDULE_STATUS_NOTIFICATIONS, solution);
    }
  }

  subscribeContinuousVisulation(solution: ContinuousVisualisationInterface){
    if(!this.visualisationSubscription) {
      this.socketEmit(VISUALISATION_SUBSCRIPTION, solution)
      this.visualisationSubscription = solution;
    }
  }

  unsubscribeContinuousVisulation(solution: ContinuousVisualisationInterface) {
    if(this.visualisationSubscription) {
      this.socketEmit(VISUALISATION_UNSUBSCRIPTION, solution)
      this.visualisationSubscription = undefined;
    }
  }

  socketEmit(eventName: string, data: any) {
    if(this.socket.connected) {
      this.socket.emit(eventName, data)
    } else {
      const socketSubscription: Subscription = this.socketConnected.subscribe({
        next: (connected: boolean) => {
          this.socket.emit(eventName, data)
          socketSubscription.unsubscribe()
        }
      })
    }
  }
}
