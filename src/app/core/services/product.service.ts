import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ApiResponse } from '../models/product.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  getProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(API_ENDPOINTS.PRODUCTS.BASE);
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(API_ENDPOINTS.PRODUCTS.DETAIL(id));
  }

  createProduct(product: Partial<Product>): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(API_ENDPOINTS.PRODUCTS.BASE, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(API_ENDPOINTS.PRODUCTS.DETAIL(id), product);
  }

  deleteProduct(id: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(API_ENDPOINTS.PRODUCTS.DELETE(id), {});
  }
}
