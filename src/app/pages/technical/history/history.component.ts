import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
interface Message {
  user: string;
  text: string;
}

interface Task {
  device: string;
  type: string;
  date: string;
  status: string;
  summary: string;
  description: string;
  messages: Message[];
}

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent {

  tasks: Task[] = [
    {
      device: 'Laptop HP',
      type: 'Mantenimiento',
      date: '2026-04-10',
      status: 'Completado',
      summary: 'Limpieza interna',
      description: 'Cambio de pasta térmica y limpieza completa',
      messages: [
        { user: 'Usuario', text: 'Está lenta' },
        { user: 'Técnico', text: 'Se hará mantenimiento' }
      ]
    }
  ];

  filteredTasks: Task[] = [...this.tasks];

  search: string = '';
  filterStatus: string = '';

  selectedTask: Task | null = null;
  chatTask: Task | null = null;
  newMessage: string = '';

  get total() {
    return this.tasks.length;
  }

  get completados() {
    return this.tasks.filter(t => t.status === 'Completado').length;
  }

  get pendientes() {
    return this.tasks.filter(t => t.status === 'Pendiente').length;
  }

  filterTasks() {
    this.filteredTasks = this.tasks.filter(t => {

      const matchSearch =
        t.device.toLowerCase().includes(this.search.toLowerCase()) ||
        t.type.toLowerCase().includes(this.search.toLowerCase()) ||
        t.date.includes(this.search);

      const matchStatus =
        this.filterStatus === '' || t.status === this.filterStatus;

      return matchSearch && matchStatus;
    });
  }

  openDetail(task: Task) {
    this.selectedTask = task;
  }

  openChat(task: Task) {
    this.chatTask = task;
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.chatTask) return;

    this.chatTask.messages.push({
      user: 'Técnico',
      text: this.newMessage
    });

    this.newMessage = '';
  }

}