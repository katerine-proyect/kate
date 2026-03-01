import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { ApiResponse } from '../models/product.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private http = inject(HttpClient);

  getSales(page: number = 1, pageSize: number = 10): Observable<ApiResponse<Order[]>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    
    return this.http.get<ApiResponse<Order[]>>(API_ENDPOINTS.SALES.BASE, { params });
  }

  getSale(id: number): Observable<ApiResponse<Order>> {
    return this.http.get<ApiResponse<Order>>(API_ENDPOINTS.SALES.DETAIL(id));
  }

  getDashboardStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(API_ENDPOINTS.SALES.STATS);
  }

  createSale(order: Order): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(API_ENDPOINTS.SALES.BASE, order);
  }

  updateSale(id: number, order: any): Observable<ApiResponse<number>> {
    return this.http.patch<ApiResponse<number>>(API_ENDPOINTS.SALES.UPDATE(id), order);
  }
}
