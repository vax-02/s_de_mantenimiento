import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface User {
  name: string;
  email: string;
  role: string;
    status: string;
}
@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
    users: User[] = [
    { name: 'Juan Perez', email: 'juan@gmail.com', role: 'Administrador', status: 'Activo' },
    { name: 'Maria Lopez', email: 'maria@gmail.com', role: 'Técnico', status: 'Bloqueado' }
  ];

  filteredUsers: User[] = [...this.users];

  search: string = '';

  showModal: boolean = false;

  newUser: User = {
    name: '',
    email: '',
    role: '',
    status: 'Activo'
  };

  roles: string[] = ['Administrador', 'Técnico', 'Usuario'];

  // 🔍 BUSCADOR
  filterUsers() {
    this.filteredUsers = this.users.filter(u =>
      u.name.toLowerCase().includes(this.search.toLowerCase()) ||
      u.email.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  // ➕ AGREGAR
  addUser() {
    this.users.push({ ...this.newUser });
    this.filteredUsers = [...this.users];

    this.newUser = { name: '', email: '', role: '', status: 'Activo' };
    this.showModal = false;
  }

  // ❌ ELIMINAR
  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.filteredUsers = [...this.users];
  }

  // 📊 KPIs
  get totalUsers() {
    return this.users.length;
  }

  get activos() {
    return this.users.filter(u => u.status === 'Activo').length;
  }

  get bloqueados() {
    return this.users.filter(u => u.status === 'Bloqueado').length;
  }
}
