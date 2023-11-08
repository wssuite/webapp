import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { TOKEN_INVALID, LOGIN_REQUIRED } from 'src/app/constants/regex';
import { LOGIN } from 'src/app/constants/app-routes';


@Component({
  selector: "app-error-message-dialog",
  templateUrl: "./error-message-dialog.component.html",
  styleUrls: ["./error-message-dialog.component.css"],
})
export class ErrorMessageDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
    @Inject(MatDialog) private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private router: Router
  ) {}

  ngOnInit() {
    if(this.data.message.includes(TOKEN_INVALID) ||
       this.data.message.includes(LOGIN_REQUIRED)) {
     this.dialog.afterAllClosed.subscribe((value: void) => {
       this.router.navigate(["/" + LOGIN]);
     })
    }
  }
}
