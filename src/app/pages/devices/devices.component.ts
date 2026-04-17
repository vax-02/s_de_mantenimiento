import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Equipment {
  id: number;
  code: string;
  type: string;
  brand: string;
  model: string;
  serial: string;
  location: string;
}

@Component({
  selector: 'app-devices',
  imports: [FormsModule, CommonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
})
export class DevicesComponent {

  equipments: Equipment[] = [
    {
      id: 1,
      code: 'EQ-001',
      type: 'PC',
      brand: 'Dell',
      model: 'Optiplex 7050',
      serial: 'ABC123',
      location: 'Oficina 1'
    }
  ];

  filtered: Equipment[] = [...this.equipments];

  search: string = '';

  showModal = false;
  editMode = false;
  showDetail = false;

  selectedEquipment: Equipment | null = null;

  newEquipment: Equipment = this.resetForm();

  types = ['PC', 'Laptop', 'Impresora'];

  // 🔍 BUSCAR
  filter() {
    this.filtered = this.equipments.filter(e =>
      e.code.toLowerCase().includes(this.search.toLowerCase()) ||
      e.brand.toLowerCase().includes(this.search.toLowerCase()) ||
      e.location.toLowerCase().includes(this.search.toLowerCase())
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
    const index = this.equipments.findIndex(e => e.id === this.newEquipment.id);
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
    this.equipments = this.equipments.filter(e => e.id !== id);
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
      location: ''
    };
  }

  // 📊 KPIs
  get total() {
    return this.equipments.length;
  }

  get pcs() {
    return this.equipments.filter(e => e.type === 'PC').length;
  }

  get laptops() {
    return this.equipments.filter(e => e.type === 'Laptop').length;
  }
}
