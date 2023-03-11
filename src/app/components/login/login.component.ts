import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MAIN_MENU } from 'src/app/constants/app-routes';
import { Credentials, UserInfo } from 'src/app/models/Credentials';
import { APIService } from 'src/app/services/api-service/api.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string;
  password: string;
  usernameControlForm: FormControl;
  passwordControlForm: FormControl;

  constructor(private router: Router, private apiService: APIService, private dialog: MatDialog) {
    this.username = "";
    this.password = "";
    this.usernameControlForm = new FormControl(null, Validators.required);
    this.passwordControlForm = new FormControl(null, Validators.required);
  }

  @HostListener('window:keyup',['$event'])
  handleKeyEvent(event: KeyboardEvent){
    if(event.key === 'Enter'){
      this.login();
    }
  }
  
  login() {
    const credentials: Credentials = {
      username: this.username,
      password: this.password,
    }
    this.apiService.login(credentials).subscribe({
      next: (value: UserInfo)=>{
        CacheUtils.pushUserInfo(value);
        this.router.navigate(["/" + MAIN_MENU]);
      },
      error: (err: HttpErrorResponse)=> {
        this.dialog.open(ErrorMessageDialogComponent, {
          data: {message: err.error},
        })
      }
    })
  }

  hasError():boolean{
    return this.passwordControlForm.hasError('required') || this.usernameControlForm.hasError('required');
  }
}
