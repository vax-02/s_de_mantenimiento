import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface HistoryEvent {
  date: string;
  title: string;
  description: string;
  user: string;
}

interface Maintenance {
  id: number;
  equipment: string;
  type: string;
  technician: string;
  status: string;
  date: string;
  description: string;
  history: HistoryEvent[];
}
@Component({
  selector: 'app-maintenances',
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenances.component.html',
  styleUrl: './maintenances.component.css',
})
export class MaintenancesComponent {
  maintenances: Maintenance[] = [
    {
      id: 1,
      equipment: 'EQ-001',
      type: 'Correctivo',
      technician: 'Juan Perez',
      status: 'Finalizado',
      date: '2026-04-10',
      description: 'Reparación de fuente',
      history: [
        {
          date: '2026-04-08',
          title: 'Registro',
          description: 'Se registró el mantenimiento',
          user: 'Admin',
        },
        {
          date: '2026-04-09',
          title: 'Asignación',
          description: 'Se asignó técnico',
          user: 'Admin',
        },
        {
          date: '2026-04-10',
          title: 'Finalización',
          description: 'Equipo reparado correctamente',
          user: 'Juan Perez',
        },
      ],
    },
  ];

  filtered = [...this.maintenances];

  search = '';

  showModal = false;
  showDetail = false;
  editMode = false;

  selected: Maintenance | null = null;

  newMaintenance: Maintenance = this.reset();

  types = ['Preventivo', 'Correctivo'];
  statuses = ['Pendiente', 'En proceso', 'Finalizado'];
  technicians = ['Juan Perez', 'Maria Lopez', 'Carlos Rojas'];

  // 🔍 BUSCAR
  filter() {
    this.filtered = this.maintenances.filter((m) =>
      m.equipment.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  // ➕ CREAR
  openCreate() {
    this.editMode = false;
    this.newMaintenance = this.reset();
    this.showModal = true;
  }

  add() {
    this.newMaintenance.id = Date.now();
    this.maintenances.push({ ...this.newMaintenance });
    this.refresh();
    this.showModal = false;
  }

  // ✏️ EDITAR
  openEdit(m: Maintenance) {
    this.editMode = true;
    this.newMaintenance = { ...m };
    this.showModal = true;
  }

  update() {
    const i = this.maintenances.findIndex(
      (m) => m.id === this.newMaintenance.id,
    );
    this.maintenances[i] = { ...this.newMaintenance };
    this.refresh();
    this.showModal = false;
  }

  // 👁 DETALLE / HISTORIAL
  openDetail(m: Maintenance) {
    this.selected = m;
    this.showDetail = true;
  }

  // ❌ ELIMINAR
  delete(id: number) {
    this.maintenances = this.maintenances.filter((m) => m.id !== id);
    this.refresh();
  }

  refresh() {
    this.filtered = [...this.maintenances];
  }

  reset(): Maintenance {
    return {
      id: 0,
      equipment: '',
      type: '',
      technician: '',
      status: 'Pendiente',
      date: '',
      description: '',
      history: [], 
    };
  }

  // 📊 KPIs
  get total() {
    return this.maintenances.length;
  }

  get pendientes() {
    return this.maintenances.filter((m) => m.status === 'Pendiente').length;
  }

  get proceso() {
    return this.maintenances.filter((m) => m.status === 'En proceso').length;
  }

  get finalizados() {
    return this.maintenances.filter((m) => m.status === 'Finalizado').length;
  }
}
