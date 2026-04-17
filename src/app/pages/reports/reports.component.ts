import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
@Component({
  selector: 'app-reports',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  equipmentChartData = {
    labels: ['PC-01', 'PC-02', 'Laptop-05', 'Servidor-01', 'Impresora-02'],
    datasets: [
      {
        label: 'Reparaciones',
        data: [5, 2, 8, 3, 6],
        backgroundColor: '#3b82f6',
      },
    ],
  };
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
  failureTypeChartData = {
    labels: ['Hardware', 'Software', 'Red', 'Sistema', 'Periféricos'],
    datasets: [
      {
        data: [12, 20, 5, 8, 10],
        backgroundColor: [
          '#ef4444',
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#8b5cf6',
        ],
      },
    ],
  };
  trendChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Reparaciones',
        data: [10, 15, 8, 20, 25, 18],
        borderColor: '#22c55e',
        fill: false,
      },
    ],
  };
  statusChartData = {
  labels: ['Abierto', 'En proceso', 'Resuelto', 'Cerrado', 'Reabierto'],
  datasets: [
    {
      data: [10, 15, 20, 8, 3],
      backgroundColor: [
        '#ef4444',
        '#f59e0b',
        '#22c55e',
        '#3b82f6',
        '#a855f7'
      ]
    }
  ]
};
}
