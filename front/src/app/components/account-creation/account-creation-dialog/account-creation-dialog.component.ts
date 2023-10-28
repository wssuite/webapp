import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {  MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { Credentials } from 'src/app/models/Credentials';
import { AccountService } from 'src/app/services/account/account.service';


@Component({
  selector: 'app-account-creation-dialog',
  templateUrl: './account-creation-dialog.component.html',
  styleUrls: ['./account-creation-dialog.component.css']
})
export class AccountCreationDialogComponent {

  username: string;
  password: string;
  passwordConfirmation: string;
  usernameControlForm: FormControl;
  passwordControlForm : FormControl;
  passwordConfirmationControlForm: FormControl;
  disabled: boolean;

  constructor(public dialogRef: MatDialogRef<AccountCreationDialogComponent >,  private api: AccountService,
     private dialog: MatDialog) { 
    this.username = "";
    this.password = "";
    this.passwordConfirmation = "";
    this.usernameControlForm = new FormControl(null, Validators.required);
    this.passwordControlForm = new FormControl(null, Validators.required);
    this.passwordConfirmationControlForm = new FormControl(null, Validators.required);
    this.disabled = true;
  }
  
  addAccount() {
    try
    {
      const credentials: Credentials = {
        username: this.username,
        password: this.password
      }
      this.api.addAccount(credentials).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.close();
          }
          else{
            this.openErrorDialog(err.error)
          }
        } 
      })
    }
    catch(e){
      console.log(e);
    }
  }

  confirmPassword(): boolean {
    return this.password !== this.passwordConfirmation;
  }

  hasError():boolean{
    this.disabled = this.confirmPassword();
    return this.passwordControlForm.hasError('required') || this.usernameControlForm.hasError('required') || this.passwordConfirmationControlForm.hasError('required') || this.disabled;
  }

  getErrorMessage() {
    if(this.passwordConfirmation === ""){
      return "";
    }
      return 'Please make sure yours password match.';
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%', 
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message},
    })
  }


  createAccount() {
    this.addAccount();
  }

  close(){
    this.dialogRef.close();
  }
  
}
