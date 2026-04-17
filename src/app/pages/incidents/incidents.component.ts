import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementRef, ViewChild, AfterViewChecked } from '@angular/core';

interface Attachment {
  name: string;
  type: string;
  url: string;
}

interface Comment {
  user: string;
  message: string;
  date: string;
  attachments?: Attachment[];
}

interface Incident {
  id: number;
  title: string;
  description: string;
  user: string;
  status: string;
  date: string;
  comments: Comment[];
}

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css'],
})
export class IncidentsComponent {
  // 📌 DATA
  incidents: Incident[] = [];
  filtered: Incident[] = [];

  search = '';

  // 📌 MODALS
  showModal = false;
  showDetail = false;

  selected: Incident | null = null;

  // 📌 FORM
  newIncident: Incident = this.reset();
  newComment = '';
  selectedFiles: File[] = [];

  statuses = ['Abierta', 'Cerrada'];

  constructor() {
    this.refresh();
  }

  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch {}
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  // 🔍 BUSCAR
  filter() {
    this.filtered = this.incidents.filter((i) =>
      i.title.toLowerCase().includes(this.search.toLowerCase()),
    );
  }

  // ➕ CREAR INCIDENCIA
  openCreate() {
    this.newIncident = this.reset();
    this.showModal = true;
  }

  add() {
    this.newIncident.id = Date.now();
    this.newIncident.date = new Date().toISOString().split('T')[0];
    this.newIncident.comments = [];

    this.incidents.push({ ...this.newIncident });
    this.refresh();
    this.showModal = false;
  }

  // 👁 VER DETALLE (CHAT)
  openDetail(i: Incident) {
    this.selected = i;
    this.showDetail = true;
  }

  // 📎 SELECCIONAR ARCHIVOS
  onFileSelected(event: any) {
    const files = event.target.files;

    for (let file of files) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];

      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten PDF o imágenes');
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Archivo demasiado grande (máx 5MB)');
        continue;
      }

      this.selectedFiles.push(file);
    }
  }

  // ❌ ELIMINAR ARCHIVO
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  // 💬 AGREGAR COMENTARIO
  /*addComment() {
    if (!this.newComment.trim() && this.selectedFiles.length === 0) return;

    const attachments: Attachment[] = this.selectedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
    }));

    this.selected?.comments.push({
      user: 'Admin',
      message: this.newComment,
      date: new Date().toISOString(),
      attachments,
    });

    this.newComment = '';
    this.selectedFiles = [];
  }*/
  addComment() {
    this.selected?.comments.push({
      user: 'admin',
      message: this.newComment,
      date: new Date().toISOString(),
      //attachments: this.selectedFiles,
    });

    this.newComment = '';
    this.selectedFiles = [];

    this.scrollToBottom();
  }

  // 🔄 CAMBIAR ESTADO (Cerrar)
  changeStatus(i: Incident) {
    i.status = 'Cerrada';
  }

  // 🔄 REFRESH
  refresh() {
    this.filtered = [...this.incidents];
  }

  // 🔄 RESET FORM
  reset(): Incident {
    return {
      id: 0,
      title: '',
      description: '',
      user: '',
      status: 'Abierta',
      date: '',
      comments: [],
    };
  }

  // 📊 KPIs
  get total() {
    return this.incidents.length;
  }

  get abiertas() {
    return this.incidents.filter((i) => i.status === 'Abierta').length;
  }

  get cerradas() {
    return this.incidents.filter((i) => i.status === 'Cerrada').length;
  }
}
