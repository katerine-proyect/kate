import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
})
export class UsersListComponent implements OnInit {
  private userService = inject(UserService);
  
  users = signal<User[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  // Modal State
  isFormOpen = signal(false);
  selectedUser = signal<User | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.userService.getUsers().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.users.set(response.data);
        } else {
          this.errorMessage.set(response.listErros.join(', '));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar usuarios');
        this.isLoading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.selectedUser.set(null);
    this.isFormOpen.set(true);
  }

  openEditForm(user: User): void {
    this.selectedUser.set(user);
    this.isFormOpen.set(true);
  }

  handleFormClosed(success: boolean): void {
    this.isFormOpen.set(false);
    this.selectedUser.set(null);
    if (success) {
      this.loadUsers();
    }
  }

  toggleStatus(id: number): void {
    this.userService.toggleUserStatus(id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.loadUsers();
        } else {
          alert('Error: ' + response.listErros.join(', '));
        }
      },
      error: (err) => alert('Error al procesar la solicitud')
    });
  }
}
