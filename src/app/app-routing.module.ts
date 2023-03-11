import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountCreationComponent } from "./components/account-creation/account-creation.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractsViewComponent } from "./components/contracts-view/contracts-view.component";
import { LoginComponent } from "./components/login/login.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { ShiftGroupComponent } from "./components/shift-component/shift-group/shift-group.component";
import { ShiftsTypeViewComponent } from "./components/shift-component/shifts-type-view/shifts-type-view.component";
import { ShiftsViewComponent } from "./components/shift-component/shifts-view/shifts-view.component";
import { TestingComponent } from "./components/testing/testing.component";
import {
  CREATE_ACCOUNT,
  CONSULT_SCHEDULE,
  CONTRACTS,
  MAIN_MENU,
  SCHEDULE_GENERATION,
  SHIFT,
  SHIFT_GROUP,
  SHIFT_TYPE,
  TESTING,
  LOGIN,
} from "./constants/app-routes";

const routes: Routes = [
  { path: "", redirectTo: "/" + LOGIN, pathMatch: "full" },
  { path: LOGIN, component: LoginComponent },
  { path: MAIN_MENU, component: MainMenuComponent },
  { path: CONSULT_SCHEDULE, component: ConsultScheduleComponent },
  { path: SCHEDULE_GENERATION, component: ScheduleGenerationComponent },
  { path: TESTING, component: TestingComponent },
  { path: SHIFT, component: ShiftsViewComponent},
  { path: SHIFT_TYPE, component: ShiftsTypeViewComponent},
  { path: SHIFT_GROUP, component: ShiftGroupComponent},
  { path: CONTRACTS, component: ContractsViewComponent},
  { path: CREATE_ACCOUNT, component: AccountCreationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
