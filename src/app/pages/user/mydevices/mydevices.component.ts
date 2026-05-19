import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DeviceService } from '../../../core/services/device.service';
import { TicketService } from '../../../services/ticket.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-mydevices',
  imports: [CommonModule, FormsModule],
  templateUrl: './mydevices.component.html',
  styleUrl: './mydevices.component.css',
})
export class MydevicesComponent {
  constructor(
    private deviceService: DeviceService,
    private ticketService: TicketService,
  ) {}

  // Estados para mensajes
  ticketMessage: { type: 'success' | 'error' | null; text: string } = {
    type: null,
    text: '',
  };
  isCreatingTicket = false;
  ticketTitle: string = '';
  ticketDescription: string = '';
  ticketType: number = 1;
  ticketTypes = [
    { value: 1, label: 'Hardware' },
    { value: 2, label: 'Software' },
  ];
  selectedFiles: File[] = [];
  devices: {
    id: number;
    brand: string;
    type: number;
    model: string;
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

  ngOnInit() {
    this.loadDevices();
  }
  loadDevices() {
    // Aquí podrías cargar los dispositivos asignados al usuario desde el backend
    const auth = localStorage.getItem('auth');
    var authData: { id: 0 } = { id: 0 };
    if (auth) {
      authData = JSON.parse(auth);
    }

    this.deviceService.getMyDevices(authData.id).subscribe((data: any) => {
      this.devices = data;
    });
  }
  openDetail(device: any) {
    this.selectedDevice = device;

    this.ticketService
      .listMyTickets(
        JSON.parse(localStorage.getItem('auth') || '{}').id,
        this.selectedDevice.id,
      )
      .subscribe((data: any) => {
        this.selectedDevice.tickets = data;
      });
  }

  closeModal() {
    this.selectedDevice = null;
  }
  ticketDevice: any = null;

  openTicket(device: any) {
    this.ticketDevice = device;
    this.resetTicketForm();
  }

  resetTicketForm() {
    this.ticketTitle = '';
    this.ticketDescription = '';
    this.ticketType = 1;
    this.selectedFiles = [];
    this.ticketMessage = { type: null, text: '' };
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        // Validar extensión
        if (!allowedExtensions.includes(fileExtension || '')) {
          this.ticketMessage = {
            type: 'error',
            text: `El archivo "${file.name}" no es permitido. Solo se permiten: PDF e imágenes (JPG, PNG, GIF, WebP)`,
          };
          continue;
        }

        // Validar tamaño
        if (file.size > maxFileSize) {
          this.ticketMessage = {
            type: 'error',
            text: `El archivo "${file.name}" es muy grande. Máximo 5MB.`,
          };
          continue;
        }

        this.selectedFiles.push(file);
      }

      if (this.selectedFiles.length > 0) {
        this.ticketMessage = {
          type: 'success',
          text: `${this.selectedFiles.length} archivo(s) seleccionado(s)`,
        };
      }
    }
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  addTicket() {
    if (
      !this.ticketTitle ||
      !this.ticketDescription ||
      !this.ticketType ||
      !this.ticketDevice
    ) {
      return;
    }

    this.isCreatingTicket = true;

    const auth = localStorage.getItem('auth');
    let userId = 0;
    if (auth) {
      const authData = JSON.parse(auth);
      userId = authData.id;
    }
    const formData = new FormData();

    formData.append('title', this.ticketTitle);
    formData.append('description', this.ticketDescription);
    formData.append('type', this.ticketType.toString());
    formData.append('status', '1');
    formData.append('user_id', userId.toString());
    formData.append('device_id', this.ticketDevice.id.toString());

    // Agregar archivos
    this.selectedFiles.forEach((file) => {
      formData.append('files[]', file);
    });

    // Agregar archivos
    this.selectedFiles.forEach((file) => {
      formData.append('files[]', file);
    });

    this.ticketService.create(formData).subscribe({
      next: (response: any) => {
        this.isCreatingTicket = false;

        console.log('Ticket creado:', response);
        this.ticketDevice = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Ticket creado',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      },
      error: (error: any) => {
        this.isCreatingTicket = false;

        console.error('Error al crear ticket:', error);
      },
    });
  }
  selectedTicket: any = null;

  chatMessages: any[] = [];

  closeChat() {
    this.selectedTicket = null;
  }

  newMessage = '';

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
    });

    this.newMessage = '';
  }
}
