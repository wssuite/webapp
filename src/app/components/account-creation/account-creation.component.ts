import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountCreationDialogComponent } from './account-creation-dialog/account-creation-dialog.component';
import { APIService } from 'src/app/services/api-service/api.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent implements OnInit{
  accounts: string[]
  connectedUser!:boolean;
  
  constructor(public dialog: MatDialog, private api: APIService) {
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

  deleteAccount(account: string){
    try
    {
      this.api.deleteAccount(account).subscribe({
        error: (err: HttpErrorResponse)=> {
          if(err.status === HttpStatusCode.Ok) {
            this.getAccounts();
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

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      data: {message: message},
    })
  }

  openCreateAccountDialog(){
    const dialog = this.dialog.open(AccountCreationDialogComponent,  
      { disableClose: true,  
        height: '60%',
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', startTime: '', endTime: ''}
      });
    dialog.afterClosed().subscribe(()=>{
      this.getAccounts();
    })

  }
}
