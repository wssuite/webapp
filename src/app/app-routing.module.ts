import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultScheduleComponent } from './components/consult-schedule/consult-schedule.component';
import { ContractCreationComponent } from './components/contract-creation/contract-creation.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ScheduleGenerationComponent } from './components/schedule-generation/schedule-generation.component';
import { CONSULT_SCHEDULE, CREATE_CONTRACT, MAIN_MENU, SCHEDULE_GENERATION } from './constants/app-routes';

const routes: Routes = [
  {path:"",redirectTo:'/'+ MAIN_MENU, pathMatch:"full"},
  {path:MAIN_MENU, component: MainMenuComponent},
  {path:CONSULT_SCHEDULE, component: ConsultScheduleComponent},
  {path:CREATE_CONTRACT, component: ContractCreationComponent},
  {path:SCHEDULE_GENERATION, component: ScheduleGenerationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
