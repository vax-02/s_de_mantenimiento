import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../../core/services/device.service';
@Component({
  selector: 'app-mydevices',
  imports: [CommonModule, FormsModule],
  templateUrl: './mydevices.component.html',
  styleUrl: './mydevices.component.css',
})
export class MydevicesComponent {
  constructor(private deviceService: DeviceService) {}
  devices: {
    id: number;
    brand: string;
    type: string;
    detail: string;
    created_at: string;
    status: number;
  }[] = [];
  statuses: { [key: number]: string } = {
    1: 'Sin asignación',
    2: 'En uso',
    3: 'En mantenimiento',
    4: 'Retirado',
  };
  selectedDevice: any = null;

  maintenanceHistory = [
    { date: '2026-01-10', description: 'Cambio de disco duro' },
    { date: '2026-03-05', description: 'Limpieza interna' },
  ];

  ngOnInit() {
    this.loadDevices();
  }
  loadDevices() {
    // Aquí podrías cargar los dispositivos asignados al usuario desde el backend
    const auth = localStorage.getItem('auth');
    var authData: {id : 0} = {id: 0};
    if (auth) {
      authData = JSON.parse(auth);
    }

    this.deviceService.getMyDevices(authData.id).subscribe((data: any) => {
      this.devices = data;
      console.log(data);
    });
    console.log('Dispositivos cargados:', this.devices);
  }
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
