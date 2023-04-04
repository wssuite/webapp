import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADD_NURSE_URL, REMOVE_NURSE_URL, FETCH_ALL_NURSE_USERNAME, UPDATE_NURSE_URL, FETCH_NURSE_BY_USERNAME, FETCH_NURSE_URL } from 'src/app/constants/api-constants';
import { NurseInterface } from 'src/app/models/Nurse';
import { TOKEN_STRING, CacheUtils, PROFILE_STRING } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';

@Injectable({
  providedIn: 'root'
})
export class NurseService {

  constructor(private httpClient: HttpClient) { }

  addNurse(nurse: NurseInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_NURSE_URL, nurse, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeNurse(nurse_username: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("username", nurse_username);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_NURSE_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getAllNurseUsername(): Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<string[]>(FETCH_ALL_NURSE_USERNAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateNurse(nurse: NurseInterface):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.put<HttpResponse<string>>(UPDATE_NURSE_URL, nurse, {
        params: queryParams,
      });
    }catch(err){
      throw new Error("user not logged in");
    }
  }

  getNurseByUserName(nurse_username: string):Observable<NurseInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("username", nurse_username);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<NurseInterface>(FETCH_NURSE_BY_USERNAME, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getAllNurse(): Observable<NurseInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<NurseInterface[]>(FETCH_NURSE_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }
}
