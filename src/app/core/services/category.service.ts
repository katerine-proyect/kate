import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/product.model';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(API_ENDPOINTS.CATEGORIES.BASE);
  }

  getCategory(id: number): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(API_ENDPOINTS.CATEGORIES.DETAIL(id));
  }

  createCategory(category: Partial<Category>): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(API_ENDPOINTS.CATEGORIES.BASE, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(API_ENDPOINTS.CATEGORIES.DETAIL(id), category);
  }

  deleteCategory(id: number): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(API_ENDPOINTS.CATEGORIES.DELETE(id), {});
  }
}
