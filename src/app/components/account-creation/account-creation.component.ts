import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account } from 'src/app/models/Account';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent {
  accounts: Account[]
  
  constructor(public dialog: MatDialog) {
    this.accounts = [
      {username: "test1"},
      {username: "test test"},
      {username: "test test test"},
      {username: "test1234567891234566789"},
      {username: "test"}
    ]
  }

  createAccount(){
    console.log("create account")
  }
}
