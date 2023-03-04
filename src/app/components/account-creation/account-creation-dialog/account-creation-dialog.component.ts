import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account } from 'src/app/models/Account';

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

  constructor(public dialogRef: MatDialogRef<AccountCreationDialogComponent >, @Inject(MAT_DIALOG_DATA) public data: Account ) { 
    this.username = "";
    this.password = "";
    this.passwordConfirmation = "";
  }
  

  createAccount() {
    console.log("account created");
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
  
}
