import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADD_SHIFT_TYPE_URL, FETCH_SHIFT_TYPE_BY_NAMES, FETCH_SHIFT_TYPE_NAMES, REMOVE_SHIFT_TYPE_URL, UPDATE_SHIFT_TYPE_URL } from 'src/app/constants/api-constants';
import { ShiftTypeInterface } from 'src/app/models/Shift';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';

@Injectable({
  providedIn: 'root'
})
export class ShiftTypeService {

  constructor(private httpClient: HttpClient) { }

  addShiftType(shiftType: ShiftTypeInterface):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(ADD_SHIFT_TYPE_URL, shiftType, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  removeShiftType(shiftType_name: string):Observable<HttpResponse<string>>{
    try{
      console.log("removeShiftType");
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shiftType_name);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.delete<HttpResponse<string>>(REMOVE_SHIFT_TYPE_URL, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  updateShiftType(shiftType: ShiftTypeInterface):Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.put<HttpResponse<string>>(UPDATE_SHIFT_TYPE_URL, shiftType, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }
  getShiftTypeNames():Observable<string[]> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<string[]>(FETCH_SHIFT_TYPE_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in");
    }
  }

  getShiftTypeByName(shiftType_name: string):Observable<ShiftTypeInterface> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append("name", shiftType_name);
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<ShiftTypeInterface>(FETCH_SHIFT_TYPE_BY_NAMES, {
        params: queryParams,
      });
    }catch(err){
      throw new Exception("user not logged in")
    }
  }
}
