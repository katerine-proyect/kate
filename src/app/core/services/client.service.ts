import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../models/client.model';
import { ApiResponse } from '../models/product.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private http = inject(HttpClient);

  getClients(): Observable<ApiResponse<Client[]>> {
    return this.http.get<ApiResponse<Client[]>>(API_ENDPOINTS.CLIENTS.BASE);
  }

  getClient(id: number): Observable<ApiResponse<Client>> {
    return this.http.get<ApiResponse<Client>>(API_ENDPOINTS.CLIENTS.DETAIL(id));
  }

  createClient(client: Partial<Client>): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(API_ENDPOINTS.CLIENTS.BASE, client);
  }

  updateClient(id: number, client: Partial<Client>): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(API_ENDPOINTS.CLIENTS.DETAIL(id), client);
  }

  deleteClient(id: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(API_ENDPOINTS.CLIENTS.DELETE(id), {});
  }
}
