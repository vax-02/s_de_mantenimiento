import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  imports: [FormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  user = {
    name: 'Javier',
    email: 'javier@email.com',
    role: 'Administrador',
    image: 'https://i.pravatar.cc/150',
  };

  isModalOpen = false;

  showCurrent = false;
  showNew = false;
  showConfirm = false;

  form = {
    current: '',
    new: '',
    confirm: '',
  };

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  changePassword() {
    if (this.form.new !== this.form.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log(this.form);
    this.closeModal();
  }
}
