import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.css',
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);
  
  clients = signal<Client[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading.set(true);
    this.clientService.getClients().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.clients.set(response.data);
        } else {
          this.errorMessage.set(response.listErros.join(', '));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar clientes');
        this.isLoading.set(false);
      }
    });
  }

  deleteClient(id: number): void {
    if (confirm('¿Estás seguro de que deseas desactivar este cliente?')) {
      this.clientService.deleteClient(id).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.loadClients();
          } else {
            alert('Error: ' + response.listErros.join(', '));
          }
        },
        error: (err) => alert('Error al procesar la solicitud')
      });
    }
  }
}
