import { CONTRACTS, SHIFT, CREATE_ACCOUNT, NURSE, VIEW_SCHEDULES } from "src/app/constants/app-routes";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { MAIN_MENU_BUTTONS } from "src/app/constants/mainMenuButton";
import { MainMenuButton } from "src/app/models/MainMenuButton";
import { CacheUtils } from "src/app/utils/CacheUtils";

@Component({
  selector: "app-main-menu",
  templateUrl: "./main-menu.component.html",
  styleUrls: ["./main-menu.component.css"],
})
export class MainMenuComponent implements OnInit{
  buttons: MainMenuButton[];
  isAdminUser!: boolean;
  connectedUser!: boolean;

  constructor(private router: Router, private dialog: MatDialog) {
    this.buttons = MAIN_MENU_BUTTONS;
  }

  ngOnInit(): void {
    try{
      this.isAdminUser = CacheUtils.getIsAdmin();
      this.connectedUser = true;
    }
    catch(err){
      this.connectedUser = false;
    }
  }


  getAlignmentDirection(button:MainMenuButton ,index: number): string {
    if(button.title === "User"){
      return "center";
    }
    return index % 2 === 0 ? "start" : "end";
  }

  redirect(button: MainMenuButton) {
    switch (button.title) {
      case "Schedule":
        this.router.navigate(["/" + VIEW_SCHEDULES]);
        break;
      case "Nurse":
        this.router.navigate(["/" + NURSE]);
        break;
      case "Shift":
        this.router.navigate(["/" + SHIFT]);
        break;
      case "Contracts":
        this.router.navigate(["/" + CONTRACTS]);
        break;
      case "User":
        this.router.navigate(["/" + CREATE_ACCOUNT]);
        break;
      default:
        break;
    }
  }

  show(button: MainMenuButton): boolean{
    if(button.title === "User" && !this.isAdminUser){
      return false;
    }
    return true;
  }
}
