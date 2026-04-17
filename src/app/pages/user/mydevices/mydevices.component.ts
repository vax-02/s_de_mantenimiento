import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-mydevices',
  imports: [CommonModule, FormsModule],
  templateUrl: './mydevices.component.html',
  styleUrl: './mydevices.component.css',
})
export class MydevicesComponent {
  devices = [
    {
      id: 1,
      name: 'PC Oficina 01',
      code: 'PC-001',
      type: 'PC',
      status: 'Activo',
      lastMaintenance: '2026-04-10',
    },
    {
      id: 2,
      name: 'Laptop Técnico',
      code: 'LT-002',
      type: 'Laptop',
      status: 'Mantenimiento',
      lastMaintenance: '2026-03-28',
    },
  ];
  selectedDevice: any = null;

  maintenanceHistory = [
    { date: '2026-01-10', description: 'Cambio de disco duro' },
    { date: '2026-03-05', description: 'Limpieza interna' },
  ];

  openDetail(device: any) {
    this.selectedDevice = device;
  }

  closeModal() {
    this.selectedDevice = null;
  }
  ticketDevice: any = null;

  openTicket(device: any) {
    this.ticketDevice = device;
  }
  selectedTicket: any = null;

  chatMessages: any[] = [];

  
  closeChat() {
    this.selectedTicket = null;
  }

  newMessage = '';


  selectedFiles: any[] = [];

  openChat(ticket: any) {
    this.selectedTicket = ticket;

    this.chatMessages = [
      {
        from: 'usuario',
        message: 'El equipo sigue sin encender',
        time: '10:00',
      },
      {
        from: 'tecnico',
        message: 'Estamos revisando la fuente de poder',
        time: '10:05',
      },
    ];
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatMessages.push({
      from: 'usuario',
      message: this.newMessage,
      time: new Date().toLocaleTimeString(),
      attachments: this.selectedFiles,
    });

    this.newMessage = '';
    this.selectedFiles = [];
  }

  onFileSelected(event: any) {
    const files = event.target.files;

    for (let file of files) {
      this.selectedFiles.push({
        name: file.name,
        type: file.type,
        url: URL.createObjectURL(file),
      });
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

}
