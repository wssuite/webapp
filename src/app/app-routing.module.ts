import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractCreationComponent } from "./components/contract-creation/contract-creation.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { ShiftGroupComponent } from "./components/shift-component/shift-group/shift-group.component";
import { ShiftTypeComponent } from "./components/shift-component/shift-type/shift-type.component";
import { ShiftComponent } from "./components/shift-component/shift/shift.component";
import { TestingComponent } from "./components/testing/testing.component";
import {
  CONSULT_SCHEDULE,
  CREATE_CONTRACT,
  MAIN_MENU,
  SCHEDULE_GENERATION,
  SHIFT,
  SHIFT_GROUP,
  SHIFT_TYPE,
  TESTING,
} from "./constants/app-routes";

const routes: Routes = [
  { path: "", redirectTo: "/" + MAIN_MENU, pathMatch: "full" },
  { path: MAIN_MENU, component: MainMenuComponent },
  { path: CONSULT_SCHEDULE, component: ConsultScheduleComponent },
  { path: CREATE_CONTRACT, component: ContractCreationComponent },
  { path: SCHEDULE_GENERATION, component: ScheduleGenerationComponent },
  { path: TESTING, component: TestingComponent },
  { path: SHIFT, component: ShiftComponent},
  { path: SHIFT_TYPE, component: ShiftTypeComponent},
  { path: SHIFT_GROUP, component: ShiftGroupComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
