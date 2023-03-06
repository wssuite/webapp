import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountCreationDialogComponent } from './account-creation-dialog/account-creation-dialog.component';
import { APIService } from 'src/app/services/api-service/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent {
  accounts: string[]
  connectedUser!:boolean;
  
  constructor(public dialog: MatDialog, private apiService: APIService) {
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
    this.apiService.getAccountsUsername().subscribe({
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
        width: '50%', 
        position: {top:'5vh',left: '25%', right: '25%'},
        data: {name: '', startTime: '', endTime: ''}
      });
    dialog.afterClosed().subscribe(()=>{
      this.getAccounts();
    })

  }
}
