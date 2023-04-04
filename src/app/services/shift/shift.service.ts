import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADD_SHIFT_URL, FETCH_ALL_SHIFT, FETCH_SHIFT_BY_NAMES, FETCH_SHIFT_NAMES, REMOVE_SHIFT_URL, UPDATE_SHIFT_URL } from 'src/app/constants/api-constants';
import { ShiftInterface } from 'src/app/models/Shift';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  constructor(private httpClient: HttpClient) { }

  addShift(shift: ShiftInterface):Observable<HttpResponse<string>>{
    try{
      console.log("addShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_SHIFT_URL, shift, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }
  
  removeShift(shift_name: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShift");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      queryParams = queryParams.append("name", shift_name);
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_SHIFT_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateShift(shift: ShiftInterface):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.put<HttpResponse<string>>(UPDATE_SHIFT_URL, shift,{params: queryParams});
    }catch(err){
      throw new Exception("user not logged in");
    }
    
  }

  getAllShift():Observable<ShiftInterface[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<ShiftInterface[]>(FETCH_ALL_SHIFT, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }
  getShiftNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<string[]>(FETCH_SHIFT_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }

  getShiftByName(shift_name: string):Observable<ShiftInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shift_name);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<ShiftInterface>(FETCH_SHIFT_BY_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }
}
