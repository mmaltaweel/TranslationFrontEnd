import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectManagementComponent } from './project-management/project-management.component';
import { TaskManagementComponent } from './task-management/task-management.component';
import { ProjectStatisticsComponent } from './project-statistics/project-statistics.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './login/guard/AuthGuard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'projects',
    component: ProjectManagementComponent,
    canActivate: [AuthGuard],

  },
  {
    path: 'tasks',
    component: TaskManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'statistics',
    component: ProjectStatisticsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }