import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultScheduleComponent } from './components/consult-schedule/consult-schedule.component';
import { ContractCreationComponent } from './components/contract-creation/contract-creation.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ScheduleGenerationComponent } from './components/schedule-generation/schedule-generation.component';

const routes: Routes = [
  {path:"",redirectTo:'/schedule-generation', pathMatch:"full"},
  {path:"main-menu", component: MainMenuComponent},
  {path:"consult-schedule", component: ConsultScheduleComponent},
  {path:"create-contract", component: ContractCreationComponent},
  {path:"schedule-generation", component: ScheduleGenerationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
