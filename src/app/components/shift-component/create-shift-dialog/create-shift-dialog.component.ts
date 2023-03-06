import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftInterface } from 'src/app/models/Shift';
import { APIService } from 'src/app/services/api-service/api.service';




@Component({
  selector: 'app-create-shift-dialog',
  templateUrl: './create-shift-dialog.component.html',
  styleUrls: ['./create-shift-dialog.component.css']
})
export class CreateShiftDialogComponent {
  
  inputControlForm = new FormGroup({
    name: new FormControl(null, Validators.required),
  });
  constructor(public dialogRef: MatDialogRef<CreateShiftDialogComponent >, 
    @Inject(MAT_DIALOG_DATA) public data: ShiftInterface,  
    private api: APIService,
                                        
    ) { 
}


add() {
  try
  { 
    //call api service to push the contract
    console.log(this.data);
    this.api.addShift(this.data).subscribe({
      error: (err: HttpErrorResponse)=> {
        if(err.status === HttpStatusCode.Ok) {
          this.close();
        }
        else{
          //this.openErrorDialog(err.error)
        }
      } 
    })
  }
  catch(e){
    console.log("error")
    //this.openErrorDialog((e as Exception).getMessage())
  }
}

/*openErrorDialog(message: string) {
  this.dialog.open(ErrorMessageDialogComponent, {
    data: {message: message},
  })
}*/


close(){
  this.dialogRef.close();
}


}
