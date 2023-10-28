import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-error-message-dialog",
  templateUrl: "./error-message-dialog.component.html",
  styleUrls: ["./error-message-dialog.component.css"],
})
export class ErrorMessageDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
