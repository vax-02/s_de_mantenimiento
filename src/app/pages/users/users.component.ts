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
    {
      name: 'Juan Perez',
      email: 'juan@gmail.com',
      role: 'Administrador',
      status: 'Activo',
    },
    {
      name: 'Maria Lopez',
      email: 'maria@gmail.com',
      role: 'Técnico',
      status: 'Bloqueado',
    },
  ];

  filteredUsers: User[] = [...this.users];

  search: string = '';

  showModal: boolean = false;

  newUser: User = {
    name: '',
    email: '',
    role: '',
    status: 'Activo',
  };

  roles: string[] = ['Administrador', 'Técnico', 'Usuario'];

  // 🔍 BUSCADOR
  filterUsers() {
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  // ➕ AGREGAR
  addUser() {
    if (this.editingIndex !== null) {
      // EDITAR
      const userIndex = this.users.findIndex(
        (u) => u.email === this.filteredUsers[this.editingIndex!].email,
      );

      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.newUser };
      }

      this.editingIndex = null;
    } else {
      // CREAR
      this.users.push({ ...this.newUser });
    }

    this.syncUsers();

    this.newUser = { name: '', email: '', role: '', status: 'Activo' };
    this.showModal = false;
  }
  syncUsers() {
    this.filteredUsers = [...this.users];
  }

  // ❌ ELIMINAR
  deleteUser(index: number) {
    this.users.splice(index, 1);
    this.filteredUsers = [...this.users];
  }

  toggleStatus(index: number) {
    const user = this.filteredUsers[index];

    user.status = user.status === 'Activo' ? 'Bloqueado' : 'Activo';

    // sincronizar con lista original
    this.syncUsers();
  }
  editingIndex: number | null = null;

  editUser(index: number) {
    this.editingIndex = index;
    this.newUser = { ...this.filteredUsers[index] };
    this.showModal = true;
  }
  // 📊 KPIs
  get totalUsers() {
    return this.users.length;
  }

  get activos() {
    return this.users.filter((u) => u.status === 'Activo').length;
  }

  get bloqueados() {
    return this.users.filter((u) => u.status === 'Bloqueado').length;
  }
}
