import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '../constants/api-endpoints';

export interface OrderItem {
  id?: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: string;
  subtotal: string;
}

export interface ClientInfo {
  id: number;
  nombre: string;
}

export interface Order {
  id: number;
  numero_pedido: string;
  cliente: ClientInfo | null;
  vendedor: string;
  total: string;
  estado: string;
  fecha_creacion: string;
  items: OrderItem[];
}

export interface CortesEstadisticas {
  total_pedidos: number;
  cantidad_productos: number;
  total_pagado: number;
  total_no_pagado: number;
}

export interface CortesResponse {
  filtros: {
    fecha_inicio: string;
    fecha_fin: string;
    cliente_id: string | null;
  };
  estadisticas: CortesEstadisticas;
  pedidos: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http = inject(HttpClient);

  getCortes(fechaInicio: string, fechaFin: string, clienteId?: number): Observable<{ status: number; data: CortesResponse; listErros: string[] }> {
    let params = new HttpParams()
      .set('fecha_inicio', fechaInicio)
      .set('fecha_fin', fechaFin);

    if (clienteId) {
      params = params.set('cliente_id', clienteId.toString());
    }

    return this.http.get<{ status: number; data: CortesResponse; listErros: string[] }>(
      API_ENDPOINTS.SALES.CORTES,
      { params }
    );
  }
}