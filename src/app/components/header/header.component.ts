import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LOGIN } from 'src/app/constants/app-routes';
import { APIService } from 'src/app/services/api-service/api.service';
import { CacheUtils } from 'src/app/utils/CacheUtils';
import { ErrorMessageDialogComponent } from '../error-message-dialog/error-message-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private apiService: APIService, private router: Router,
    private dialog: MatDialog){}

  logout() {
    try{
      this.apiService.logout().subscribe({
        error: (err: HttpErrorResponse)=>{
          if(err.status === HttpStatusCode.Ok){
            this.router.navigate(["/" + LOGIN]);
            CacheUtils.emptyCache();
          }
          else{
            this.openErrorDialog(err.error)
          }
        }
      })
    }catch(err){
      this.openErrorDialog((err as Error).message);
    }
  }

  openErrorDialog(message: string){
    this.dialog.open(ErrorMessageDialogComponent, {
      data:{message: message},
    })    
  }

}
