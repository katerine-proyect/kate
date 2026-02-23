import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { STORAGE_KEYS } from '../models/constants';

interface User {
  username: string;
  email?: string;
  token?: string;
}

interface LoginResponse {
  status: number;
  data: {
    token: string;
  };
}

import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private _currentUser = signal<User | null>(null);
  
  // Computed signal for auth state
  currentUser = computed(() => this._currentUser());
  isLoggedIn = computed(() => !!this._currentUser());

  constructor() {
    this.checkSession();
  }

  private checkSession(): void {
    const savedSession = localStorage.getItem(STORAGE_KEYS.AUTH_KEY);
    if (savedSession) {
      try {
        this._currentUser.set(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_KEY);
      }
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, { username, password }).pipe(
      tap(response => {
        if (response.status === 200) {
          const user: User = { username, token: response.data.token };
          this._currentUser.set(user);
          localStorage.setItem(STORAGE_KEYS.AUTH_KEY, JSON.stringify(user));
        }
      })
    );
  }

  logout(): void {
    this._currentUser.set(null);
    localStorage.removeItem(STORAGE_KEYS.AUTH_KEY);
  }
}
