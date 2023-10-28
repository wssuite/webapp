import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CREATE_EMPTY_PROFILE, DELETE_PROFILE, DOWNLOAD_IMPORT_TEMPLATE, DUPLICATE_PROFILE, EXPORT_PROFILE, FETACH_PROFILES, FETCH_PROFILE_ACCESSORS, IMPORT_PROFILE, REVOKE_PROFILE_ACCESS, SAVE_IMPORT, SHARE_PROFILE } from 'src/app/constants/api-constants';
import { BaseProfile, DetailedProfile, DetailedProblemProfile } from 'src/app/models/Profile';
import { CacheUtils, PROFILE_STRING, TOKEN_STRING } from 'src/app/utils/CacheUtils';
import { Exception } from 'src/app/utils/Exception';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  profileChanged: Subject<boolean>;
  newImportedProfileCreated: Subject<boolean>;

  constructor(private httpClient: HttpClient) {
    this.profileChanged = new Subject();
    this.newImportedProfileCreated = new Subject()
  }

  emitNewProfileCreation(verdict: boolean){
    this.newImportedProfileCreated.next(verdict);
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
      CacheUtils.removeSavedGenerationRequestItems(CacheUtils.getProfile())
      return this.httpClient.delete<HttpResponse<string>>(DELETE_PROFILE, {
        params: queryParams,
      })
    } catch(err){
      throw new Exception("user not logged in");
    }
  }

  deleteProfileByName(name: string): Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, name);
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

  import(formData: FormData): Observable<DetailedProblemProfile>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<DetailedProblemProfile>(IMPORT_PROFILE, formData, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }

  save(profile: DetailedProfile): Observable<HttpResponse<string>> {
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.post<HttpResponse<string>>(SAVE_IMPORT, profile, {
        params: queryParams,
      })
    }
    catch(err) {
      throw new Error("user not logged in");
    }
  }

  export(): Observable<{content: string}>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      queryParams = queryParams.append(PROFILE_STRING, CacheUtils.getProfile());
      return this.httpClient.get<{content: string}>(EXPORT_PROFILE, {
        params: queryParams,
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }

  downloadTemplate(): Observable<{content:string}>{
    try{
      let queryParams = new HttpParams();
      queryParams = queryParams.append(TOKEN_STRING, CacheUtils.getUserToken());
      return this.httpClient.get<{content:string}>(DOWNLOAD_IMPORT_TEMPLATE, {
        params: queryParams
      })
    }
    catch(err){
      throw new Error("user not logged in");
    }
  }
}
