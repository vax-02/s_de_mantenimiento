import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

/**
 * Interfaz para usuario
 */
export interface User {
  id: number;
  name: string;
  email: string;
  rol?: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getAll() {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.users.base}`);
  }
  getById(id: number) {
    return this.http.get(`${this.apiUrl}${API_ENDPOINTS.users.byId(id)}`);
  }
  create(data: any) {
    return this.http.post(
      `${this.apiUrl}${API_ENDPOINTS.users.base}`,
      data
    );
  }
  update(id: number, data: any) {
    return this.http.put(
      `${this.apiUrl}${API_ENDPOINTS.users.byId(id)}`,
      data
    );
  }
  delete(id: number) {
    return this.http.delete(`${this.apiUrl}${API_ENDPOINTS.users.byId(id)}`);
  }
  updateStatus(id: number, status: number) {
    return this.http.put(
      `${this.apiUrl}${API_ENDPOINTS.users.byId(id)}/status`,
      { status }
    );
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  changePassword(id: number, current: string, newPass: string) {
    return this.http.post(`${this.apiUrl}/users/${id}/change-password`, {
      user_id: id,
      current_password: current,
      new_password: newPass,
    });
  }
  searchUsers(query: string) {
  return this.http.get<User[]>(
    `${this.apiUrl}/users/search?q=${query}`
  );
}
}
