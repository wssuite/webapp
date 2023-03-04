import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-account-creation-dialog',
  templateUrl: './account-creation-dialog.component.html',
  styleUrls: ['./account-creation-dialog.component.css']
})
export class AccountCreationDialogComponent {

  constructor(public dialogRef: MatDialogRef<AccountCreationDialogComponent >, @Inject(MAT_DIALOG_DATA) public data: Account ) { 
  }
  

  createAccount() {
    console.log("account created");
    this.close();
  }

  close(){
    this.dialogRef.close();
  }
  
}
