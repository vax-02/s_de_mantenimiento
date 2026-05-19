import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { API_ENDPOINTS } from '../core/constants/api-endpoints';

export interface ticket {
  id: number;
  title: string;
  description: string;
  status: number;
  device_id?: number;
  user_id?: number;
  created_at?: string;
  updated_at?: string;
}
@Injectable({
  providedIn: 'root'
})

export class TicketService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(  `${this.apiUrl}${API_ENDPOINTS.tickets.base}`);
  }

  create(data: any){
    return this.http.post(`${this.apiUrl}${API_ENDPOINTS.tickets.base}`, data);
  }
  listMyTickets(userId: number, deviceId: number) {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.tickets.my(userId, deviceId)}`);
  }
}
      
