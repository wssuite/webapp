import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Account } from 'src/app/models/Account';
import { AccountCreationDialogComponent } from './account-creation-dialog/account-creation-dialog.component';

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

  openCreateAccountDialog(){
    this.dialog.open(AccountCreationDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', startTime: '', endTime: ''}
      });

  }
}
