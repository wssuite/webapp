import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TEST_URL } from 'src/app/constants/api-constants';

@Injectable({
  providedIn: 'root'
})
export class APIService {


  constructor(private httpClient: HttpClient) { }

  test(): Observable<string>{
    console.log(TEST_URL)
    return this.httpClient.get<string>(TEST_URL);
  }
}
