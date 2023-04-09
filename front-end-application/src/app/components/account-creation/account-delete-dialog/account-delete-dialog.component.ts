import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';
import { ErrorMessageDialogComponent } from '../../error-message-dialog/error-message-dialog.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-account-delete-dialog',
  templateUrl: './account-delete-dialog.component.html',
  styleUrls: ['./account-delete-dialog.component.css']
})
export class AccountDeleteDialogComponent {
  @Input() account!: string;
  @Output() accountChange: EventEmitter<string[]>;
  accounts: string[];
  
  constructor(public dialogRef: MatDialogRef<AccountDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:  {account: string},
    public dialog: MatDialog, private api: AccountService) {
    this.account = data.account;
    this.accounts = [];
    this.accountChange = new EventEmitter();
  }

  deleteAccount(account: string){
    try
    {
      this.api.deleteAccount(account).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.getAccounts();
            this.emitAccount();
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

  emitAccount(){
    this.accountChange.emit(this.accounts);
  }

  close(){
    this.dialogRef.close();
  }


  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }
}
