import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Role } from '../models/user.model';
import { ApiResponse } from '../models/product.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(API_ENDPOINTS.USERS.LIST);
  }

  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(API_ENDPOINTS.USERS.ROLES);
  }

  getUser(id: number): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(API_ENDPOINTS.USERS.DETAIL(id));
  }

  createUser(user: Partial<User> & { password?: string }): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(API_ENDPOINTS.USERS.CREATE, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(API_ENDPOINTS.USERS.UPDATE(id), user);
  }

  toggleUserStatus(id: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(API_ENDPOINTS.USERS.TOGGLE_STATUS(id), {});
  }
}
