import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Roles } from '../../core/constants/roles';
@Component({
  selector: 'app-sidebar-layout',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar-layout.component.html',
  styleUrl: './sidebar-layout.component.css',
})
export class SidebarLayoutComponent {
  isCollapsed = false;
  isMobileOpen = false;
  authData: any;
  roles = Roles;
  constructor(private router: Router) {}

  ngOnInit() {
    const auth = localStorage.getItem('auth');
    if (auth) {
      this.authData = JSON.parse(auth);
    } else {
      this.router.navigate(['/login']);
    }
  }
  getInitials(fullName: string): string {
    if (!fullName) return '';

    const names = fullName.trim().split(' ');

    // Solo un nombre
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    // Primera letra del primer nombre + primera letra del último apellido
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  }
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
