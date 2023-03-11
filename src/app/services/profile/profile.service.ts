import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  profileChanged: Subject<boolean>;
  
  constructor() { 
    this.profileChanged = new Subject();
  }

  emitProfileChange(){
    this.profileChanged.next(true);
  }
}
