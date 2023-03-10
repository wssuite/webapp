import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountCreationComponent } from "./components/account-creation/account-creation.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { LoginComponent } from "./components/login/login.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { ShiftGroupComponent } from "./components/shift-component/shift-group/shift-group.component";
import { ShiftTypeComponent } from "./components/shift-component/shift-type/shift-type.component";
import { ShiftsViewComponent } from "./components/shift-component/shifts-view/shifts-view.component";
import { TestingComponent } from "./components/testing/testing.component";
import {
  CREATE_ACCOUNT,
  CONSULT_SCHEDULE,
  CREATE_CONTRACT,
  LOGIN,
  MAIN_MENU,
  SCHEDULE_GENERATION,
  SHIFT,
  SHIFT_GROUP,
  SHIFT_TYPE,
  TESTING,
} from "./constants/app-routes";

const routes: Routes = [
  { path: "", redirectTo: "/" + LOGIN, pathMatch: "full" },
  { path: LOGIN, component: LoginComponent },
  { path: MAIN_MENU, component: MainMenuComponent },
  { path: CONSULT_SCHEDULE, component: ConsultScheduleComponent },
  { path: CREATE_CONTRACT, component: ContractCreationComponent },
  { path: SCHEDULE_GENERATION, component: ScheduleGenerationComponent },
  { path: TESTING, component: TestingComponent },
  { path: SHIFT, component: ShiftsViewComponent},
  { path: SHIFT_TYPE, component: ShiftTypeComponent},
  { path: SHIFT_GROUP, component: ShiftGroupComponent},
  { path: CREATE_ACCOUNT, component: AccountCreationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
