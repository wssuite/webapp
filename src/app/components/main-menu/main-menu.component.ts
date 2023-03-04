import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CONTRACTS, SCHEDULE_GENERATION } from "src/app/constants/app-routes";
import { MAIN_MENU_BUTTONS } from "src/app/constants/mainMenuButton";
import { MainMenuButton } from "src/app/models/MainMenuButton";

@Component({
  selector: "app-main-menu",
  templateUrl: "./main-menu.component.html",
  styleUrls: ["./main-menu.component.css"],
})
export class MainMenuComponent {
  buttons: MainMenuButton[];

  constructor(private router: Router, private dialog: MatDialog) {
    this.buttons = MAIN_MENU_BUTTONS;
  }

  getAlignmentDirection(index: number): string {
    return index % 2 === 0 ? "start" : "end";
  }

  redirect(button: MainMenuButton) {
    switch (button.title) {
      case "Schedule":
        this.router.navigate(["/" + SCHEDULE_GENERATION]);
        break;

      case "Contracts":
        this.router.navigate(["/" + CONTRACTS]);
        break;

      default:
        break;
    }
  }
}
