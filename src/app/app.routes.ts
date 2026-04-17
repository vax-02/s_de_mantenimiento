import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { MaintenancesComponent } from './pages/maintenances/maintenances.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MydevicesComponent } from './pages/user/mydevices/mydevices.component';
import { TasksComponent } from './pages/technical/tasks/tasks.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: SidebarLayoutComponent, children: [
    { path: 'users', component: UsersComponent },
    { path: 'mydevices', component: MydevicesComponent }, //usuario
    { path: 'tasks', component: TasksComponent }, //tecnico


    { path: 'devices', component: DevicesComponent },
    { path: 'maintenances', component: MaintenancesComponent },
    { path: 'incidents', component: IncidentsComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'profile', component: ProfileComponent },

  ]},





  { path: '', redirectTo: 'login', pathMatch: 'full' },
];