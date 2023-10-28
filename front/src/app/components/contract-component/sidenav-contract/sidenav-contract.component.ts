import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CONTRACTS, CONTRACT_GROUP} from 'src/app/constants/app-routes';
import { CONTRACT_MENU_BUTTONS } from 'src/app/constants/navButton';

@Component({
  selector: 'app-sidenav-contract',
  templateUrl: './sidenav-contract.component.html',
  styleUrls: ['./sidenav-contract.component.css']
})
export class SidenavContractComponent {
  buttons: string[]

  constructor(public dialog: MatDialog, private router: Router) {
    this.buttons = CONTRACT_MENU_BUTTONS;
  }


    redirect(button: string) {
      switch (button) {
        case "Contract":
          this.router.navigate(["/" + CONTRACTS]);
          break;
        case "Contract Group":
            this.router.navigate(["/" + CONTRACT_GROUP]);
            break;
        default:
          break;
      }
    }


}
