import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountCreationDialogComponent } from './account-creation-dialog/account-creation-dialog.component';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';
import { AccountService } from 'src/app/services/account/account.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-account-creation',
  templateUrl: './account-creation.component.html',
  styleUrls: ['./account-creation.component.css']
})
export class AccountCreationComponent implements OnInit{
  accounts: string[]
  connectedUser!:boolean;
  displayedColumns: string[]; 
  dataSource: MatTableDataSource<string>;

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  
  constructor(public dialog: MatDialog, private api: AccountService) {
    this.accounts = []
    this.displayedColumns =  ['Account','actions'];
    this.dataSource = new MatTableDataSource();
  }

  height =  '60%';
  width = '35%';
  left = '35%';
  top = '10vh';
  
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
        this.dataSource.data = usernames;
      },
      error: (error: HttpErrorResponse)=> {
        this.openErrorDialog(error.error);
      }
    })

  }

  openErrorDialog(message: string) {
    this.dialog.open(ErrorMessageDialogComponent, {
      height: '45%',
      width: '45%', 
      position: {top:'20vh',left: '30%', right: '25%'},
      data: {message: message},
    })
  }

  onResize() {
    if (window.innerWidth <= 1200) {
      this.height = '85%';
      this.width = '45%';
      this.left = '30%';
      this.top = '8vh';
    } else {
      this.height =  '60%';
      this.width = '35%';
      this.left = '35%';
      this.top = '10vh';
    }
  }

  openCreateAccountDialog(){
    this.onResize();
    const dialog = this.dialog.open(AccountCreationDialogComponent,  
      { disableClose: true,  
        height: this.height,
        width: this.width, 
        position: {top:this.top,left: this.left, right: '25%'},
        data: {name: '', startTime: '', endTime: ''}
      });
    dialog.afterClosed().subscribe(()=>{
      this.getAccounts();
    })

  }

  openDeleteAccountDialog(account: string){
    const dialog = this.dialog.open(ConfirmationDialogComponent,  
      { disableClose: true,  
        height: '50%',
        width: '28%', 
        position: {top:'20vh',left: '38%', right: '25%'},
        data: {message: "account", elementName:account}
      });
    dialog.afterClosed().subscribe((result: boolean)=>{
      if(result){
        this.deleteAccount(account)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
}
