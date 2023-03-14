import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { APIService } from 'src/app/services/api-service/api.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-share-profile',
  templateUrl: './share-profile.component.html',
  styleUrls: ['./share-profile.component.css']
})
export class ShareProfileComponent implements OnInit {

  accessors: string[];
  users: string[];
  displayedUsers: string[];
  userCtrl: FormControl;
  filterNames: Observable<string[]>;
  usersToShareWith: string[];
  currentUser: string;
  @ViewChild('nameInput', {static:false}) nameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static:false}) autoComplete!: MatAutocomplete;
  readonly inputNameSeparators: number[] = [ENTER, COMMA];

  constructor(public dialogRef: MatDialogRef<ShareProfileComponent>,
     @Inject(MAT_DIALOG_DATA) public data: {profileName: string}, private api: APIService,
     private dialog: MatDialog){
      this.accessors = [];
      this.users = [];
      this.displayedUsers = []
      this.userCtrl = new FormControl();
      this.usersToShareWith = [];
      this.currentUser = "";
      this.filterNames = this.userCtrl.valueChanges.pipe(
        startWith(null),
        map((name:string| null)=> (name? this.filter(name): this.displayedUsers.slice()))
      )
     }

  ngOnInit(): void {
    this.currentUser = CacheUtils.getUsername()
    this.api.getAccountsUsername().subscribe({
      next:(users:string[])=>{
        this.users = users;
    },
      error: (err: HttpErrorResponse)=> this.openErrorDialog(err.error)

    })
    this.getProfileAccessors();
  }

  filter(value: string): string[] {
    const FILTER_VALUE = value.toLowerCase();
    return this.displayedUsers.filter((name: string) => name.toLowerCase().indexOf(FILTER_VALUE) === 0);
  }

  getProfileAccessors(){
    try{
      this.api.getProfileAccessors().subscribe({
        next: (accessors: string[]) => {
          this.accessors = accessors;
          this.updateUsersList();
        },
        error: (err: HttpErrorResponse) => this.openErrorDialog(err.error),
      })
    }catch(err){
      // Do nothing
    }
  }

  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  updateUsersList(){
    this.usersToShareWith = [];
    this.displayedUsers = [];
    this.users.forEach((user: string)=>{
      if(!this.accessors.includes(user)){
        this.displayedUsers.push(user);
      }
    })
  }

  removeName(name: string): void{
    const index = this.usersToShareWith.indexOf(name);
    if(index > -1){
      this.usersToShareWith.splice(index, 1);
    }
  }

  share() {
    this.api.shareProfile(this.usersToShareWith).subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.getProfileAccessors();
        }
        else{
          this.openErrorDialog(err.error);
        }
      }
    })
  }

  revoke(username: string){
    this.api.revokeAccess(username).subscribe({
      error: (err: HttpErrorResponse)=>{
        if(err.status === HttpStatusCode.Ok){
          this.getProfileAccessors();
        }
        else{
          this.openErrorDialog(err.error);
        }
      }
    })
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.usersToShareWith.push(event.option.value);
    this.nameInput.nativeElement.value = "";
    this.userCtrl.setValue(null);
  }
}
