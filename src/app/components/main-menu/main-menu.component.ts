import { MatDialog } from "@angular/material/dialog";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SCHEDULE_GENERATION } from "src/app/constants/app-routes";
import { MAIN_MENU_BUTTONS } from "src/app/constants/mainMenuButton";
import { Contract } from "src/app/models/Contract";
import { MainMenuButton } from "src/app/models/MainMenuButton";
import { ContractCreationDialogComponent } from "../contract-creation-dialog/contract-creation-dialog.component";
import { CacheUtils } from "src/app/utils/CacheUtils";

@Component({
  selector: "app-main-menu",
  templateUrl: "./main-menu.component.html",
  styleUrls: ["./main-menu.component.css"],
})
export class MainMenuComponent implements OnInit, OnDestroy{
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

  ngOnDestroy(): void {
      CacheUtils.emptyCache();
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
        this.router.navigate(["/" + SCHEDULE_GENERATION]);
        break;

      case "Contracts":
        this.dialog.open(ContractCreationDialogComponent,
           {data: {contract: new Contract()},
        })
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
