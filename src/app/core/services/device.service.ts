import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface DeviceResponse {
  id: number;
  type: string;
  brand: string;
  model: string;
  status: number;
  assigned_to?: number | null;
  created_at: string;
  updated_at: string;
}

export interface AssignmentHistory {
  id: number;
  user_id: number;
  device_id: number;
  status: number;
  user?: {
    id: number;
    email: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<DeviceResponse[]>(`${this.apiUrl}${API_ENDPOINTS.devices.base}`);
  }

  getMyDevices(id: number) {
    return this.http.get<DeviceResponse[]>(`${this.apiUrl}${API_ENDPOINTS.devices.my(id)}`);
  }

  getById(id: number) {
    return this.http.get<DeviceResponse>(`${this.apiUrl}${API_ENDPOINTS.devices.byId(id)}`);
  }

  create(data: any) {
    return this.http.post<DeviceResponse>(`${this.apiUrl}${API_ENDPOINTS.devices.base}`, data);
  }

  update(id: number, data: Partial<DeviceResponse>) {
    return this.http.put<DeviceResponse>(
      `${this.apiUrl}${API_ENDPOINTS.devices.byId(id)}`,
      data,
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}${API_ENDPOINTS.devices.byId(id)}`);
  }

  getAssignmentHistory(deviceId: number) {
    return this.http.get<AssignmentHistory[]>(
      `${this.apiUrl}${API_ENDPOINTS.devices.history(deviceId)}`,
    );
  }

  asignToUser(deviceId: number, userId: number) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.devices.assign(deviceId)}`,
      { user_id: userId }
    );
  }
}
