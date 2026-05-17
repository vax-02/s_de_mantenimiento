import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';

interface User {
  id?: number;
  name: string;
  email: string;
  rol: number | string;
  status: number;
  password: string;
}
@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  users: User[] = [];
  loading: boolean = false;
  filteredUsers: User[] = [...this.users];

  search: string = '';

  showModal: boolean = false;

  formSubmitted: boolean = false;

  validationErrors: { [key: string]: string } = {};

  newUser: User = {
    name: '',
    email: '',
    rol: '',
    status: 1,
    password: '12345678',
  };

  roles = [
    { label: 'Administrador', value: 1 },
    { label: 'Técnico', value: 2 },
    { label: 'Usuario', value: 3 },
  ];

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
  ) {}
  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (resp: any) => {
        this.users = Array.isArray(resp) ? resp : (resp?.data ?? []);
        this.syncUsers();
      },

      error: (err) => {
        console.error(err);
      },
    });
  }
  filterUsers() {
    this.filteredUsers = this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  isFormValid(): boolean {
    this.validationErrors = {};

    if (!this.newUser.name || this.newUser.name.trim() === '') {
      this.validationErrors['name'] = 'El nombre es requerido';
    }

    if (!this.newUser.email || this.newUser.email.trim() === '') {
      this.validationErrors['email'] = 'El correo es requerido';
    } else if (!this.isValidEmail(this.newUser.email)) {
      this.validationErrors['email'] = 'El correo no es válido';
    }

    if (!this.newUser.rol || this.newUser.rol === '') {
      this.validationErrors['rol'] = 'Debe seleccionar un rol';
    }

    return Object.keys(this.validationErrors).length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  addUser() {
    this.formSubmitted = true;
    if (!this.isFormValid()) {
      return;
    }
    this.loading = true;

    if (this.editingIndex !== null) {
      // EDITAR
      const userIndex = this.users.findIndex(
        (u) => u.email === this.filteredUsers[this.editingIndex!].email,
      );

      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.newUser };
      }
      this.editingIndex = null;

      this.userService
        .update((this.users[userIndex] as any).id, {
          name: this.newUser.name,
          email: this.newUser.email,
          rol: Number(this.newUser.rol),
        })
        .subscribe({
          next: (resp) => {
            console.log('Usuario actualizado:', resp);
            this.loading = false;
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Usuario actualizado',
              showConfirmButton: false,
              timer: 3000,

              timerProgressBar: true,
            });

            this.syncUsers();
            this.resetForm();
            this.showModal = false;
          },
          error: (err) => {
            console.error('Error al actualizar usuario:', err);
            this.loading = false;
            Swal.fire('Error', 'Error al actualizar usuario', 'error');
          },
        });
    } else {
      // CREAR
      this.userService
        .create({
          name: this.newUser.name,
          email: this.newUser.email,
          rol: Number(this.newUser.rol),
          password: this.newUser.password,
        })
        .subscribe({
          next: (resp) => {
            console.log('Usuario creado:', resp);
            this.newUser.id = (resp as any).id;
            this.users.push({ ...this.newUser });
            this.loading = false;
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Usuario creado',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            this.syncUsers();
            this.resetForm();
            this.showModal = false;
          },
          error: (err) => {
            console.error('Error al crear usuario:', err);
            this.loading = false;
            Swal.fire('Error', 'Error al crear usuario', 'error');
          },
        });
    }
  }

  resetForm() {
    this.newUser = {
      name: '',
      email: '',
      rol: '',
      status: 1,
      password: '12345678',
    };
    this.validationErrors = {};
    this.formSubmitted = false;
  }
  syncUsers() {
    this.filteredUsers = [...this.users];
  }

  deleteUser(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar usuario',
        message: '¿Seguro que deseas eliminar este usuario?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const user = this.filteredUsers[index];

        // Obtener el ID del usuario desde la lista de usuarios originales
        const userIndex = this.users.findIndex((u) => u.email === user.email);

        if (userIndex === -1) {
          console.error('Usuario no encontrado');
          return;
        }

        const userId = (this.users[userIndex] as any).id;

        this.userService.delete(userId).subscribe({
          next: (resp) => {
            // Eliminar de la lista original
            this.users.splice(userIndex, 1);
            // Actualizar la lista filtrada
            this.syncUsers();

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Usuario eliminado',
              showConfirmButton: false,
              timer: 2000,
              timerProgressBar: true,
            });
          },
          error: (err) => {
            console.error('Error al eliminar usuario:', err);
            Swal.fire('Error', 'Error al eliminar usuario', 'error');
          },
        });
      }
    });
  }

  toggleStatus(index: number) {
    const user = this.filteredUsers[index];
    const newStatus = user.status === 1 ? 0 : 1;

    const userIndex = this.users.findIndex((u) => u.email === user.email);

    if (userIndex === -1) {
      console.error('Usuario no encontrado');
      return;
    }

    const userId = (this.users[userIndex] as any).id;

    this.userService.updateStatus(userId, newStatus).subscribe({
      next: (resp) => {
        user.status = newStatus;
        this.users[userIndex].status = newStatus;
        this.syncUsers();
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: newStatus === 1 ? 'Usuario activado' : 'Usuario bloqueado',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        Swal.fire(
          'Error',
          'Error al actualizar el estado del usuario',
          'error',
        );
      },
    });
  }
  editingIndex: number | null = null;

  editUser(index: number) {
    this.editingIndex = index;
    this.newUser = { ...this.filteredUsers[index] };
    this.validationErrors = {};
    this.formSubmitted = false;
    this.showModal = true;
  }
  get totalUsers() {
    return this.users.length;
  }

  get activos() {
    return this.users.filter((u) => u.status === 1).length;
  }

  get bloqueados() {
    return this.users.filter((u) => u.status === 0).length;
  }

  getRolLabel(rolValue: number | string): string {
    return (
      this.roles.find((r) => r.value === Number(rolValue))?.label ||
      'No definido'
    );
  }
}
