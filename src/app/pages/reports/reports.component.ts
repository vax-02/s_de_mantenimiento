import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  // 📊 KPIs
  totalMaintenances = 25;
  preventivos = 10;
  correctivos = 15;

  abiertas = 8;
  cerradas = 12;
  criticas = 5;

  // 📊 FILTROS
  filter = {
    date: '',
    technician: '',
    type: '',
  };

  technicians = ['Juan Perez', 'Maria Lopez'];
  types = ['Preventivo', 'Correctivo'];

  // 📊 CHART MANTENIMIENTOS
  maintenanceChartData = {
    labels: ['Preventivo', 'Correctivo'],
    datasets: [
      {
        data: [this.preventivos, this.correctivos],
      },
    ],
  };

  // 📊 CHART INCIDENCIAS
  incidentChartData = {
    labels: ['Abiertas', 'Cerradas', 'Críticas'],
    datasets: [
      {
        data: [this.abiertas, this.cerradas, this.criticas],
      },
    ],
  };
}
