import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CREATE_EMPTY_PROFILE, DELETE_PROFILE, DUPLICATE_PROFILE, FETACH_PROFILES, FETCH_PROFILE_ACCESSORS, IMPORT_PROFILE, REVOKE_PROFILE_ACCESS, SHARE_PROFILE } from 'src/app/constants/api-constants';
import { BaseProfile } from 'src/app/models/Profile';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  profileChanged: Subject<boolean>;
  
  constructor(private httpClient: HttpClient) { 
    this.profileChanged = new Subject();
  }

  emitProfileChange(){
    this.profileChanged.next(true);
  }

  createEmptyProfile(name: string):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, name);
      return this.httpClient.post<HttpResponse<string>>(CREATE_EMPTY_PROFILE, null, {
        params: queryParams,
      });
    } catch(err){
      throw new Exception("user not logged in");
    }
  }

  getAllProfiles(): Observable<BaseProfile[]>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<BaseProfile[]>(FETACH_PROFILES, {
        params: queryParams,
      });
    } catch(err) {
      throw new Exception("user not logged in");
    }
  }

  duplicateProfile(newProfileName: string): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      queryParams = queryParams.append("other_profile_name", newProfileName);
      return this.httpClient.post<HttpResponse<string>>(DUPLICATE_PROFILE, null, {
        params: queryParams,
      })
    } catch(err){
      throw new Exception("user not logged in");
    }
  }
  
  deleteProfile(): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.delete<HttpResponse<string>>(DELETE_PROFILE, {
        params: queryParams,
      })
    } catch(err){
      throw new Exception("user not logged in");
    }
  }

  getProfileAccessors(): Observable<string[]>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<string[]>(FETCH_PROFILE_ACCESSORS, {
        params: queryParams,
      })
    } catch(err){
      throw new Error("user not logged in")
    }
  }

  shareProfile(users: string[]):Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.put<HttpResponse<string>>(SHARE_PROFILE, users, {
        params: queryParams
      })
    } catch(err){
      throw new Error("user not logged in");
    }
  }

  revokeAccess(user: string): Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      queryParams = queryParams.append("username", user);
      return this.httpClient.put<HttpResponse<string>>(REVOKE_PROFILE_ACCESS, null, {
        params: queryParams
      })
    } catch(err){
      throw new Error("user not logged in");
    }
  }

  import(formData: FormData): Observable<HttpResponse<string>>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(IMPORT_PROFILE, formData, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }
}
