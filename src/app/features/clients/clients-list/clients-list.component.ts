import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ClientService } from '../../../core/services/client.service';
import { Client } from '../../../core/models/client.model';
import { ApiResponse } from '../../../core/models/product.model';
import { ClientFormComponent } from '../../../shared/components/forms/client-form.component';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  imports: [CommonModule, ClientFormComponent],
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css'],
})
export class ClientsListComponent implements OnInit {
  private clientService = inject(ClientService);

  clients = signal<Client[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  modalIsOpen = signal(false);
  modalTitle = signal('');
  selectedClient = signal<Client | null>(null);
  isEditMode = signal(false);
  isSubmittingForm = signal(false);

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

  onAddClient(): void {
    this.isEditMode.set(false);
    this.selectedClient.set(null);
    this.modalTitle.set('Crear Nuevo Cliente');
    this.modalIsOpen.set(true);
  }

  onEditClient(client: Client): void {
    this.isEditMode.set(true);
    this.selectedClient.set(client);
    this.modalTitle.set('Editar Cliente');
    this.modalIsOpen.set(true);
  }

  closeModal(): void {
    this.modalIsOpen.set(false);
    this.selectedClient.set(null);
    this.isEditMode.set(false);
  }

  onClientFormSubmit(formData: Partial<Client>): void {
    this.isSubmittingForm.set(true);
    const request: Observable<ApiResponse<any>> = this.isEditMode() && this.selectedClient()?.id
      ? this.clientService.updateClient(this.selectedClient()!.id!, formData)
      : this.clientService.createClient(formData);

    request.subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.status === 200) {
          this.loadClients();
          this.closeModal();
          this.isSubmittingForm.set(false);
        } else {
          alert('Error: ' + response.listErros.join(', '));
          this.isSubmittingForm.set(false);
        }
      },
      error: (err : any) => {
        alert('Error al guardar el cliente');
        console.error(err);
        this.isSubmittingForm.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.closeModal();
  }
}
