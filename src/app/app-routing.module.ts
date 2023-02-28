import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { TestingComponent } from "./components/testing/testing.component";
import {
  CONSULT_SCHEDULE,
  CREATE_CONTRACT,
  LOGIN,
  MAIN_MENU,
  SCHEDULE_GENERATION,
  TESTING,
} from "./constants/app-routes";
import { LoginComponent } from "./components/login/login.component";

const routes: Routes = [
  { path: "", redirectTo: "/" + LOGIN, pathMatch: "full" },
  { path: LOGIN, component: LoginComponent },
  { path: MAIN_MENU, component: MainMenuComponent },
  { path: CONSULT_SCHEDULE, component: ConsultScheduleComponent },
  { path: CREATE_CONTRACT, component: ContractCreationComponent },
  { path: SCHEDULE_GENERATION, component: ScheduleGenerationComponent },
  { path: TESTING, component: TestingComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
