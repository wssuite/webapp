import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SHIFT, SHIFT_GROUP, SHIFT_TYPE, SKILL } from 'src/app/constants/app-routes';

  

@Component({
  selector: 'app-sidenav-shift',
  templateUrl: './sidenav-shift.component.html',
  styleUrls: ['./sidenav-shift.component.css']
})
export class SidenavShiftComponent {


  constructor(public dialog: MatDialog, private router: Router) {
  }


    redirect(button: string) {
      switch (button) {
        case "Shift":
          this.router.navigate(["/" + SHIFT]);
          break;
        case "Shift Type":
          this.router.navigate(["/" + SHIFT_TYPE]);
          break;
        case "Shift Group":
            this.router.navigate(["/" + SHIFT_GROUP]);
            break;
        case "Skill":
            this.router.navigate(["/" + SKILL]);
            break;
        default:
          break;
      }
    }


}
