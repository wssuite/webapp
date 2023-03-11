import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile: string;

  constructor() { 
    this.profile = "";
  }

  setProfile(newProfile: string){
    this.profile = newProfile;
  }

  getProfile(): string {
    return this.profile;
  }
}
