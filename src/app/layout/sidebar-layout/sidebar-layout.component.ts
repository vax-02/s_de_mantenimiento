import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar-layout',
  imports: [RouterModule, CommonModule  ],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css'
})
export class SidebarLayoutComponent {

  isCollapsed = false;
  isMobileOpen = false;
  constructor(private router: Router) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMobile() {
    this.isMobileOpen = !this.isMobileOpen;
  }
  loggout() {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
