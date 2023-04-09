import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountCreationDialogComponent } from './account-creation-dialog/account-creation-dialog.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { AccountService } from 'src/app/services/account/account.service';
import { AccountDeleteDialogComponent } from './account-delete-dialog/account-delete-dialog.component';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent implements OnInit{
  accounts: string[]
  connectedUser!:boolean;
  
  constructor(public dialog: MatDialog, private api: AccountService) {
    this.accounts = []
  }
  ngOnInit(): void {
    try{
      this.getAccounts();
      this.connectedUser = true;
      
    }catch(err){
      this.connectedUser = false;
    }
  }


  getAccounts(){
    this.api.getAccountsUsername().subscribe({
      next: (usernames: string[])=> {
        this.accounts= usernames;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })

  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  openCreateAccountDialog(){
    const dialog = this.dialog.open(AccountCreationDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '35%', 
        position: {top:'10vh',left: '35%', right: '25%'},
        data: {name: '', startTime: '', endTime: ''}
      });
    dialog.afterClosed().subscribe(()=>{
      this.getAccounts();
    })

  }

  openDeleteAccountDialog(account: string){
    const dialog = this.dialog.open(AccountDeleteDialogComponent,  
      { disableClose: true,  
        height: '50%',
        width: '28%', 
        position: {top:'10vh',left: '35%', right: '25%'},
        data: {account: account}
      });
    dialog.afterClosed().subscribe(()=>{
      this.getAccounts();
    })

  }
}
