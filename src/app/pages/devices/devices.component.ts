import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import {
  DeviceService,
  DeviceResponse,
  AssignmentHistory,
} from '../../core/services/device.service';
import { UserService, User } from '../../core/services/user.service';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

/**
 * Interfaz para dispositivos que incorpora tanto datos del backend
 * como propiedades adicionales del frontend
 */
interface Equipment extends DeviceResponse {
  // Propiedades heredadas de DeviceResponse:
  // id, code, type, brand, model, status, assigned_to, created_at, updated_at

  // Propiedades adicionales del frontend (opcionales)
  current_assignment?: Assignment;
  history?: Maintenance[];
  assignments?: Assignment[];
}

interface Maintenance {
  reportedBy: string;
  reportedAt: string;
  fixedBy: string;
  fixedAt: string;
  detail: string;
}

interface Assignment {
  user: {
    email: string;
  };
  start: string;
  end?: string; // null = actualmente en uso
}

@Component({
  selector: 'app-devices',
  imports: [FormsModule, CommonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
})
export class DevicesComponent implements OnInit {
  // UI State
  showModal = false;
  editMode = false;
  showDetail = false;
  showAssignModal = false;
  showHistoryModal = false;
  expandedIndex: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  // Data
  equipments: Equipment[] = [];
  filtered: Equipment[] = [];
  search: string = '';

  // Form
  newEquipment: Equipment = this.resetForm();
  selectedEquipment: Equipment | null = null;
  newAssignedUser: string = '';
  selectedUser: User | null = null;
  historyEquipment: Equipment | null = null;
  assignmentHistory: AssignmentHistory[] = [];
  historyLoading = false;

  // User Search
  searchResults: {
    id: number;
    name: string;
    email: string;
  }[] = [];
  searchLoading = false;
  private searchSubject = new Subject<string>();

  // Opciones
  types = ['PC', 'Laptop', 'Impresora'];
  statuses: { [key: number]: string } = {
    1: 'Sin asignación',
    2: 'En uso',
    3: 'En mantenimiento',
    4: 'Retirado',
  };
  constructor(
    private deviceService: DeviceService,
    private userService: UserService,
    private dialog: MatDialog,
  ) {}

  /**
   * Cargar dispositivos desde el backend al inicializar
   */
  ngOnInit() {
    this.loadDevices();
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => this.userService.searchUsers(query)),
      )
      .subscribe({
        next: (users) => {
          this.searchResults = users;
          console.log(
            'Resultados de búsqueda:',
            users,
            'VARIALE DE PASO',
            this.searchResults,
            'tamaño del array',
            this.searchResults.length,
          );
          this.searchLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.searchResults = [];
          this.searchLoading = false;
        },
      });
  }

  /**
   * Obtener todos los dispositivos del backend
   */
  private loadDevices() {
    this.isLoading = true;
    this.errorMessage = null;

    this.deviceService.getAll().subscribe({
      next: (devices) => {
        this.equipments = devices.map((device) => ({
          ...device,
          history: [],
          assignments: [],
        }));

        this.refresh();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando dispositivos:', error);
        this.errorMessage = 'Error al cargar los dispositivos';
        this.isLoading = false;
      },
    });
  }

  /**
   * Filtrar dispositivos por búsqueda
   */
  filter() {
    this.filtered = this.equipments.filter(
      (e) =>
        e.brand.toLowerCase().includes(this.search.toLowerCase()) ||
        (e.model && e.model.toLowerCase().includes(this.search.toLowerCase())),
    );
  }

  /**
   * Abrir modal para crear nuevo dispositivo
   */
  openCreate() {
    this.editMode = false;
    this.newEquipment = this.resetForm();
    this.showModal = true;
  }

  add() {
    if (!this.validateForm()) return;

    this.isLoading = true;

    const deviceData = {
      type: this.newEquipment.type,
      brand: this.newEquipment.brand,
      model: this.newEquipment.model,
    };

    this.deviceService.create(deviceData).subscribe({
      next: (device) => {
        // El dispositivo retornado ya tiene el código generado (EQ-{id})
        const newEquipment = {
          ...device,
          history: [],
          assignments: [],
        };

        this.equipments.push(newEquipment);
        this.refresh();
        this.showModal = false;
        this.isLoading = false;
        this.errorMessage = null;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Dispositivo creado',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
      error: (error) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Error al crear el dispositivo',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.isLoading = false;
        console.log('Error creando dispositivo:', this.errorMessage);
      },
    });
  }

  /**
   * Abrir modal para editar dispositivo
   */
  openEdit(eq: Equipment) {
    this.editMode = true;
    this.newEquipment = { ...eq };
    this.showModal = true;
  }

  /**
   * Actualizar dispositivo existente
   */
  update() {
    if (!this.validateForm()) return;

    this.isLoading = true;

    const deviceData: Partial<DeviceResponse> = {
      type: this.newEquipment.type,
      brand: this.newEquipment.brand,
      model: this.newEquipment.model,
    };

    this.deviceService.update(this.newEquipment.id, deviceData).subscribe({
      next: (device) => {
        const index = this.equipments.findIndex((e) => e.id === device.id);
        if (index !== -1) {
          this.equipments[index] = {
            ...device,
            history: this.equipments[index].history || [],
            assignments: this.equipments[index].assignments || [],
          };
        }
        this.refresh();
        this.showModal = false;
        this.isLoading = false;
        this.errorMessage = null;

        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Dispositivo actualizado',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
      error: (error) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Error al actualizar el dispositivo',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        this.isLoading = false;
      },
    });
  }

  /**
   * Validar datos del formulario
   */
  private validateForm(): boolean {
    if (!this.newEquipment.type.trim()) {
      this.errorMessage = 'El tipo de equipo es requerido';
      return false;
    }
    if (!this.newEquipment.brand.trim()) {
      this.errorMessage = 'La marca es requerida';
      return false;
    }
    if (!this.newEquipment.model.trim()) {
      this.errorMessage = 'El modelo es requerido';
      return false;
    }

    this.errorMessage = null;
    return true;
  }

  /**
   * Eliminar dispositivo
   */
  delete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar dispositivo',
        message: '¿Seguro que deseas eliminar este dispositivo?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;

        this.deviceService.delete(id).subscribe({
          next: () => {
            this.equipments = this.equipments.filter((e) => e.id !== id);
            this.refresh();
            this.isLoading = false;
            this.errorMessage = null;
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Dispositivo eliminado',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });
          },
          error: (error) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Error al eliminar el dispositivo',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            this.isLoading = false;
          },
        });
      }
    });
  }

  /**
   * Abrir modal de detalles
   */
  openDetail(eq: Equipment) {
    this.selectedEquipment = eq;
    this.showDetail = true;
  }

  /**
   * Abrir modal de asignación
   */
  openAssignModal(eq: Equipment) {
    this.selectedEquipment = eq;
    this.resetAssignModal();
    this.showAssignModal = true;
  }

  /**
   * Asignar usuario a dispositivo
   */
  assignUser() {
    if (!this.selectedUser || !this.selectedEquipment) {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'warning',
        title: 'Selecciona un usuario',
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    console.log('Asignando usuario:', this.selectedUser, 'al dispositivo:', this.selectedEquipment);

    const dataUser = this.selectedUser;
    this.deviceService
      .asignToUser(this.selectedEquipment.id, this.selectedUser.id)
      .subscribe({
        next: () => {
          //this.refresh();

          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Dispositivo asignado correctamente',
            showConfirmButton: false,
            timer: 3000,
          });
          const idE = this.selectedEquipment?.id;

          console.log('ID del dispositivo asignado:', dataUser);
          const device = this.filtered.find((d) => d.id === idE);
          if (device) {
            device.current_assignment = {
              user: {
                email: dataUser.email || '..',
              },
              start: new Date().toISOString(),
            };
            device.status = 2; 
          }
        },
        error: (error) => {
          console.error('Error asignando dispositivo:', error);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'Error al asignar el dispositivo',
            showConfirmButton: false,
            timer: 3000,
          });
        },
      });

    this.showAssignModal = false;
    this.resetAssignModal();
  }

  /**
   * Buscar usuarios mientras escribe
   */

  searchUsers(query: string) {
    this.searchLoading = true;
    this.newAssignedUser = query;
    if (query.trim().length === 0) {
      this.searchResults = [];
      this.selectedUser = null;
      return;
    }
    console.log('Buscar usuarios con query...:', query);
    this.searchSubject.next(query);
  }
  /**
   * Seleccionar usuario de la lista de búsqueda
   */
  selectUser(user: any) {
    this.selectedUser = user;
    this.newAssignedUser = '';
    this.searchResults = [];
  }

  /**
   * Limpiar búsqueda y resultados al cerrar modal
   */
  resetAssignModal() {
    this.newAssignedUser = '';
    this.selectedUser = null;
    this.searchResults = [];
  }

  /**
   * Obtener usuario actualmente asignado
   */
  getCurrentUser(eq: Equipment): string | null {
    //console.log('Equipamiento:', eq);

    const current = eq.current_assignment;

    return current?.user.email || null;
  }

  /**
   * Abrir modal de historial
   */
  openHistory(eq: Equipment) {
    this.historyEquipment = eq;
    this.showHistoryModal = true;
    this.loadAssignmentHistory(eq.id);
  }

  /**
   * Cargar historial de asignaciones desde el backend
   */
  private loadAssignmentHistory(deviceId: number) {
    this.historyLoading = true;
    this.deviceService.getAssignmentHistory(deviceId).subscribe({
      next: (history) => {
        this.assignmentHistory = history;
        this.historyLoading = false;
      },
      error: (error) => {
        console.error('Error cargando historial:', error);
        this.assignmentHistory = [];
        this.historyLoading = false;
      },
    });
  }

  /**
   * Obtener el nombre del estado de asignación
   */
  getAssignmentStatus(status: number): string {
    return status === 1 ? 'Activo' : 'Quitado';
  }

  /**
   * Obtener el color de badge para el estado
   */
  getStatusBadgeClass(status: number): string {
    return status === 1
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700';
  }

  /**
   * Cerrar modal de historial
   */
  closeHistory() {
    this.showHistoryModal = false;
    this.historyEquipment = null;
  }

  /**
   * Formatear fecha para mostrar
   */

  formatDate(date: string): string {
    return new Date(date).toLocaleString('es-BO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Toggle detalle expandido
   */
  toggleDetail(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  /**
   * Resetear formulario
   */
  private resetForm(): Equipment {
    return {
      id: 0,
      type: '',
      brand: '',
      model: '',
      status: 1,
      assigned_to: null,
      created_at: '',
      updated_at: '',
      history: [],
      assignments: [],
    };
  }

  /**
   * Refrescar vista
   */
  private refresh() {
    this.filter();
  }

  /**
   * KPI: Total de equipos
   */
  get total(): number {
    return this.equipments.length;
  }

  /**
   * KPI: Total de PCs
   */
  get pcs(): number {
    return this.equipments.filter((e) => e.type === 'PC').length;
  }

  /**
   * KPI: Total de Laptops
   */
  get laptops(): number {
    return this.equipments.filter((e) => e.type === 'Laptop').length;
  }
}
