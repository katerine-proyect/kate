import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, Role } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);

  @Input() user: User | null = null;
  @Output() closed = new EventEmitter<boolean>();

  userForm: FormGroup;
  roles = signal<Role[]>([]);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      apellido: [''],
      telefono: [''],
      direccion: [''],
      rol_id: [null, [Validators.required]],
      password: [''], // Only required for new users
    });
  }

  ngOnInit(): void {
    this.loadRoles();
    if (this.user) {
      this.userForm.patchValue(this.user);
      // Password is not required when editing
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // Password is required for new users
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe({
      next: (response) => {
        if (response.status === 200) {
          // Filter out Administrador (id=1) as per request if needed
          // Actually, listing roles should show all, users listing excludes id=1
          this.roles.set(response.data);
        }
      },
      error: (err) => console.error('Error fetching roles', err)
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = this.userForm.value;
    
    // If password is empty in edit mode, don't send it
    if (this.user && !formData.password) {
      delete formData.password;
    }

    const request = this.user
      ? this.userService.updateUser(this.user.id, formData)
      : this.userService.createUser(formData);

    request.subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.closed.emit(true);
        } else {
          this.errorMessage.set(response.listErros.join(', '));
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al procesar la solicitud');
        this.isSubmitting.set(false);
      }
    });
  }

  close(): void {
    this.closed.emit(false);
  }
}
