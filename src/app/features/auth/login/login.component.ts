import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      const { username, password } = this.loginForm.value;

      this.authService.login(username as string, password as string).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.status === 200) {
            this.router.navigate(['/products']);
          } else {
            this.errorMessage.set('Credenciales inválidas');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al conectar con el servidor');
          console.error('Login error:', err);
        }
      });
    }
  }
}
