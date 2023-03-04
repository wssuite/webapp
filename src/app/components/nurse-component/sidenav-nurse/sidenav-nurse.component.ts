import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NURSE, NURSE_GROUP} from 'src/app/constants/app-routes';
import { NURSE_MENU_BUTTONS } from 'src/app/constants/nurseButton';

@Component({
  selector: 'app-sidenav-nurse',
  templateUrl: './sidenav-nurse.component.html',
  styleUrls: ['./sidenav-nurse.component.css']
})
export class SidenavNurseComponent {  buttons: string[]

  constructor(public dialog: MatDialog, private router: Router) {
    this.buttons = NURSE_MENU_BUTTONS;
  }


    redirect(button: string) {
      switch (button) {
        case "Nurse":
          this.router.navigate(["/" + NURSE]);
          break;
        case "Nurse Group":
            this.router.navigate(["/" + NURSE_GROUP]);
            break;
        default:
          break;
      }
    }


}
