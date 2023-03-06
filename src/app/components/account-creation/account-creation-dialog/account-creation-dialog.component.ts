import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Account } from 'src/app/models/Account';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { Credentials } from 'src/app/models/Credentials';
import { APIService } from 'src/app/services/api-service/api.service';


@Component({
  selector: 'app-account-creation-dialog',
  templateUrl: './account-creation-dialog.component.html',
  styleUrls: ['./account-creation-dialog.component.css']
})
export class AccountCreationDialogComponent {

  username: string;
  password: string;
  passwordConfirmation: string;
  usernameControlForm = new FormGroup({
    username: new FormControl(null, Validators.required),
  });
  passwordControlForm = new FormGroup({
    password: new FormControl(null, Validators.required),
  });
  passwordConfirmationControlForm = new FormGroup({
    passwordConfirmation: new FormControl(null, Validators.required),
  });

  constructor(public dialogRef: MatDialogRef<AccountCreationDialogComponent >,  private api: APIService, private dialog: MatDialog) { 
    this.username = "";
    this.password = "";
    this.passwordConfirmation = "";
  }
  
  addAccount() {
    try
    {
      //this.service.setContract(this.data.contract)
      //this.service.validateContract();
      //call api service to push the contract
      //const contractJson = this.service.getJson();
      //console.log(contractJson);
      let account = new Account();
      const credentials: Credentials = {
        username: this.username,
        password: this.password
      }
      account.username = this.username;
      account.password = this.password;
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
    catch(e){}

    console.log("add done");
  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
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
