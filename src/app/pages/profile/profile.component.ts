import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Roles } from '../../core/constants/roles';
import { UserService } from '../../core/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  roles = Roles;
  isModalOpen = false;
  isLoading = false;
  user: any = null;
  showCurrent = false;
  showNew = false;
  showConfirm = false;

  form = {
    current: '',
    new: '',
    confirm: '',
  };

  constructor(private userService: UserService) {}
  ngOnInit() {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const authData = JSON.parse(auth);
      this.user = authData;
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  changePassword() {
    // Validar que los campos no estén vacíos
    if (!this.form.current || !this.form.new || !this.form.confirm) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos requeridos',
        text: 'Por favor completa todos los campos',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // Validar que las contraseñas coincidan
    if (this.form.new !== this.form.confirm) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // Validar que la nueva contraseña tenga al menos 8 caracteres
    if (this.form.new.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseña muy corta',
        text: 'La contraseña debe tener al menos 8 caracteres',
        position: 'top-end',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    this.isLoading = true;

    this.userService
      .changePassword(this.user.id, this.form.current, this.form.new)
      .subscribe({
        next: (resp: any) => {
          this.isLoading = false;

          Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: resp.message || 'Contraseña actualizada correctamente',
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });

          // Limpiar formulario y cerrar modal
          this.form = {
            current: '',
            new: '',
            confirm: '',
          };
          this.closeModal();
        },
        error: (err) => {
          this.isLoading = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Error al cambiar la contraseña',
            position: 'top-end',
            toast: true,
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
          });
        },
      });
  }
}
