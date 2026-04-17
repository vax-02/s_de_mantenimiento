import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent {
  tasks = [
    {
      id: 1,
      code: 'TCK-001',
      title: 'PC no enciende',
      device: 'PC-001 Dell',
      priority: 'Alta',
      status: 'Asignado',
      user: 'Juan Perez',
      assignedAt: '2026-04-17',
      assignedTime: '09:35',

      chat: [
        {
          from: 'usuario',
          message: 'El equipo no enciende',
          time: '10:00',
        },
      ],
    },
  ];

  selectedTask: any = null;
  statusTask: any = null;

  newMessage = '';

  newStatus = '';
  openChat(task: any) {
    this.selectedTask = task;
  }

  closeChat() {
    this.selectedTask = null;
    this.newMessage = '';
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.selectedTask.chat.push({
      from: 'tecnico',
      message: this.newMessage,
      time: new Date().toLocaleTimeString(),
    });

    this.newMessage = '';
  }

  openStatusModal(task: any) {
    this.statusTask = task;
    this.newStatus = task.status;
  }

  closeStatusModal() {
    this.statusTask = null;
  }

  updateStatus() {
    if (!this.statusTask) return;

    this.statusTask.status = this.newStatus;
    this.statusTask = null;
  }
}
