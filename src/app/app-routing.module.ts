import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountCreationComponent } from "./components/account-creation/account-creation.component";
import { ConsultScheduleComponent } from "./components/consult-schedule/consult-schedule.component";
import { ContractsViewComponent } from "./components/contracts-view/contracts-view.component";
import { ImportProfileComponent } from "./components/create-profile-dialog/import-profile-dialog/import-profile-dialog.component";
import { LoginComponent } from "./components/login/login.component";
import { MainMenuComponent } from "./components/main-menu/main-menu.component";
import { NurseGroupViewComponent } from "./components/nurse-component/nurse-group-view/nurse-group-view.component";
import { NurseViewComponent } from "./components/nurse-component/nurse-view/nurse-view.component";
import { ScheduleGenerationComponent } from "./components/schedule-generation/schedule-generation.component";
import { SchedulesGalleryComponent } from "./components/schedules-gallery/schedule-view.component";
import { ShiftGroupViewComponent } from "./components/shift-component/shifts-group-view/shifts-group-view.component";
import { ShiftsTypeViewComponent } from "./components/shift-component/shifts-type-view/shifts-type-view.component";
import { ShiftsViewComponent } from "./components/shift-component/shifts-view/shifts-view.component";
import { SkillViewComponent } from "./components/skill-view/skill-view.component";
import { TestingComponent } from "./components/testing/testing.component";
import {
  CREATE_ACCOUNT,
  CONSULT_SCHEDULE,
  CONTRACTS,
  MAIN_MENU,
  NURSE,
  NURSE_GROUP,
  SCHEDULE_GENERATION,
  SHIFT,
  SHIFT_GROUP,
  SHIFT_TYPE,
  TESTING,
  LOGIN,
  SKILL,
  IMPORT,
  VIEW_SCHEDULES,
} from "./constants/app-routes";

const routes: Routes = [
  { path: "", redirectTo: "/" + LOGIN, pathMatch: "full" },
  { path: LOGIN, component: LoginComponent },
  { path: MAIN_MENU, component: MainMenuComponent },
  { path: CONSULT_SCHEDULE, component: ConsultScheduleComponent },
  { path: SCHEDULE_GENERATION, component: ScheduleGenerationComponent },
  { path: NURSE, component: NurseViewComponent},
  { path: NURSE_GROUP, component: NurseGroupViewComponent},
  { path: TESTING, component: TestingComponent },
  { path: SHIFT, component: ShiftsViewComponent},
  { path: SHIFT_TYPE, component: ShiftsTypeViewComponent},
  { path: SHIFT_GROUP, component: ShiftGroupViewComponent},
  { path: CONTRACTS, component: ContractsViewComponent},
  { path: CREATE_ACCOUNT, component: AccountCreationComponent },
  { path: SKILL, component: SkillViewComponent},
  { path: IMPORT, component: ImportProfileComponent},
  {path: VIEW_SCHEDULES, component: SchedulesGalleryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
