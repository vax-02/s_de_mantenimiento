import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private userService: UserService,
  ) {}

  login() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Debe ingresar correo y contraseña';
      return;
    }

    this.userService.login(this.email, this.password).subscribe({
      next: (resp: any) => {
        localStorage.setItem('auth', JSON.stringify(resp));

        if (resp?.message) {
          this.errorMessage = resp.message;
        }
        if(resp.rol == 1) {
        this.router.navigate(['/home/reports']);
        }else if(resp.rol == 2) {
          this.router.navigate(['/home/tasks']);
        }else{
          this.router.navigate(['/home/mydevices']);
        }

      },
      error: (err) => {
        console.error('Login failed:', err);
        if (err?.error?.message) {
          this.errorMessage = err.error.message;
        } else if (err?.message) {
          this.errorMessage = err.message;
        } else {
          this.errorMessage = 'Error al iniciar sesión';
        }
      },
    });
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
