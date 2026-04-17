import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { DevicesComponent } from './pages/devices/devices.component';
import { MaintenancesComponent } from './pages/maintenances/maintenances.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { SidebarLayoutComponent } from './layout/sidebar-layout/sidebar-layout.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'home', component: SidebarLayoutComponent, children: [
    { path: 'users', component: UsersComponent },
    { path: 'devices', component: DevicesComponent },
    { path: 'maintenances', component: MaintenancesComponent },
    { path: 'incidents', component: IncidentsComponent },
    { path: 'reports', component: ReportsComponent },

  ]},





  { path: '', redirectTo: 'login', pathMatch: 'full' },
];