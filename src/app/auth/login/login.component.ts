import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.email && this.password) {
      console.log('Login:', this.email);

      // Simulación de login
      localStorage.setItem('auth', 'true');

      console.log(localStorage.getItem('auth')); // Verifica que el valor se haya guardado
      this.router.navigate(['/home/reports']); // cambia según tu ruta
    }
  }

  logout() {
    localStorage.removeItem('auth');
    this.router.navigate(['/login']);
  }
}
