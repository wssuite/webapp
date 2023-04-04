import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADD_NURSE_GROUP_URL, REMOVE_NURSE_GROUP_URL, UPDATE_NURSE_GROUP_URL, FETCH_NURSE_GROUP_BY_NAME, FETCH_ALL_NURSE_GROUP_NAME, FETCH_NURSE_GROUP_URL } from 'src/app/constants/api-constants';
import { NurseGroupInterface } from 'src/app/models/Nurse';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';

@Injectable({
  providedIn: 'root'
})
export class NurseGroupService {

  constructor(private httpClient: HttpClient) { }

  addNurseGroup(nurseGroup: NurseGroupInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_NURSE_GROUP_URL, nurseGroup, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeNurseGroup(nurseGroup_name: string):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", nurseGroup_name);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_NURSE_GROUP_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }


  
  updateNurseGroup(nurseGroup: NurseGroupInterface):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.put<HttpResponse<string>>(UPDATE_NURSE_GROUP_URL, nurseGroup, {
        params: queryParams,
      });
    } catch(err){
      throw new Error("user not logged in");
    }
  }

  getNurseGroupByName(nurseGroup_name: string):Observable<NurseGroupInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", nurseGroup_name);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<NurseGroupInterface>(FETCH_NURSE_GROUP_BY_NAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getAllNurseGroup(): Observable<NurseGroupInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<NurseGroupInterface[]>(FETCH_NURSE_GROUP_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getAllNurseGroupName(): Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<string[]>(FETCH_ALL_NURSE_GROUP_NAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }
}
