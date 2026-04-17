import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Maintenance {
  reportedBy: string;
  reportedAt: string;
  fixedBy: string;
  fixedAt: string;
  detail: string;
}
interface Assignment {
  user: string;
  start: string;
  end?: string; // null = actualmente en uso
}
interface Equipment {
  id: number;
  code: string;
  type: string;
  brand: string;
  model: string;
  serial: string;
  detail: string;

  status: 'Sin asignación' | 'Asignado' | 'En mantenimiento' | 'Dado de baja';
  history: Maintenance[];
  assignments: Assignment[];
}

@Component({
  selector: 'app-devices',
  imports: [FormsModule, CommonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
})
export class DevicesComponent {
  showAssignModal = false;
  selectedEquipment: Equipment | null = null;
  newAssignedUser: string = '';
  showHistoryModal = false;
  historyEquipment: Equipment | null = null;
  equipments: Equipment[] = [
    {
      id: 1,
      code: 'EQ-001',
      type: 'PC',
      brand: 'Dell',
      model: 'Optiplex 7050',
      serial: 'ABC123',
      detail: 'Equipo de oficina principal',
      status: 'En mantenimiento',
      history: [
        {
          reportedBy: 'Juan Perez',
          reportedAt: '2026-04-10',
          fixedBy: 'Carlos Tech',
          fixedAt: '2026-04-12',
          detail: 'Cambio de fuente de poder',
        },
      ],
      assignments: [],
    },
  ];

  filtered: Equipment[] = [...this.equipments];

  search: string = '';

  showModal = false;
  editMode = false;
  showDetail = false;

  newEquipment: Equipment = this.resetForm();

  types = ['PC', 'Laptop', 'Impresora'];

  // 🔍 BUSCAR
  filter() {
    this.filtered = this.equipments.filter(
      (e) =>
        e.code.toLowerCase().includes(this.search.toLowerCase()) ||
        e.brand.toLowerCase().includes(this.search.toLowerCase()) ||
        e.detail.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  // ➕ CREAR
  openCreate() {
    this.editMode = false;
    this.newEquipment = this.resetForm();
    this.showModal = true;
  }

  add() {
    this.newEquipment.id = Date.now();
    this.equipments.push({ ...this.newEquipment });
    this.refresh();
    this.showModal = false;
  }

  // ✏️ EDITAR
  openEdit(eq: Equipment) {
    this.editMode = true;
    this.newEquipment = { ...eq };
    this.showModal = true;
  }

  update() {
    const index = this.equipments.findIndex(
      (e) => e.id === this.newEquipment.id,
    );
    this.equipments[index] = { ...this.newEquipment };
    this.refresh();
    this.showModal = false;
  }

  // 👁 DETALLE
  openDetail(eq: Equipment) {
    this.selectedEquipment = eq;
    this.showDetail = true;
  }

  // ❌ ELIMINAR
  delete(id: number) {
    this.equipments = this.equipments.filter((e) => e.id !== id);
    this.refresh();
  }

  // 🔄 REFRESH
  refresh() {
    this.filtered = [...this.equipments];
  }
  resetForm(): Equipment {
    return {
      id: 0,
      code: '',
      type: '',
      brand: '',
      model: '',
      serial: '',
      detail: '',

      status: 'Sin asignación', // 👈 valor por defecto
      history: [], // 👈 historial vacío
      assignments: [], // 👈 sin asignaciones
    };
  }
  updateStatus(eq: Equipment) {
    const index = this.equipments.findIndex((e) => e.id === eq.id);
    if (index !== -1) {
      this.equipments[index].status = eq.status;
      this.refresh();
    }
  }
  openAssignModal(eq: Equipment) {
    this.selectedEquipment = eq;
    this.newAssignedUser = '';
    this.showAssignModal = true;
  }
  getCurrentUser(eq: Equipment): string | null {
    const current = eq.assignments.find((a) => !a.end);
    return current ? current.user : null;
  }
  assignUser() {
    if (!this.selectedEquipment || !this.newAssignedUser) return;

    const now = new Date().toISOString();

    // cerrar asignación actual
    const current = this.selectedEquipment.assignments.find((a) => !a.end);
    if (current) {
      current.end = now;
    }

    // nueva asignación
    this.selectedEquipment.assignments.push({
      user: this.newAssignedUser,
      start: now,
    });

    // actualizar estado automáticamente
    this.selectedEquipment.status = 'Asignado';

    this.refresh();
    this.showAssignModal = false;
  }
  expandedIndex: number | null = null;
openHistory(eq: Equipment) {
  this.historyEquipment = eq;
  this.showHistoryModal = true;
}
closeHistory() {
  this.showHistoryModal = false;
  this.historyEquipment = null;
}
formatDate(date: string): string {
  return new Date(date).toLocaleString();
}
  toggleDetail(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
  // 📊 KPIs
  get total() {
    return this.equipments.length;
  }

  get pcs() {
    return this.equipments.filter((e) => e.type === 'PC').length;
  }

  get laptops() {
    return this.equipments.filter((e) => e.type === 'Laptop').length;
  }
}
