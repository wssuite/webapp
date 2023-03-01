import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SCHEDULE_GENERATION, SHIFT, SHIFT_GROUP, SHIFT_TYPE } from 'src/app/constants/app-routes';
import { SHIFT_MENU_BUTTONS } from 'src/app/constants/shiftButton';
import { CreateShiftDialogComponent } from '../create-shift-dialog/create-shift-dialog.component';

@Component({
  selector: 'app-sidenav-shift',
  templateUrl: './sidenav-shift.component.html',
  styleUrls: ['./sidenav-shift.component.css']
})
export class SidenavShiftComponent {
  buttons: string[]

  constructor(public dialog: MatDialog, private router: Router) {
    this.buttons = SHIFT_MENU_BUTTONS;
  }


    redirect(button: string) {
      switch (button) {
        case "Shift":
          this.router.navigate(["/" + SHIFT]);
          break;
        case "Shift-Type":
          this.router.navigate(["/" + SHIFT_TYPE]);
          break;
        case "Shift-Group":
            this.router.navigate(["/" + SHIFT_GROUP]);
            break;
        default:
          break;
      }
    }


}
