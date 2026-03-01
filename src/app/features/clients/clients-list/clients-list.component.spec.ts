import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientsListComponent } from './clients-list.component';
import { ClientService } from '../../../core/services/client.service';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Client } from '../../../core/models/client.model';
import { By } from '@angular/platform-browser';
import { describe, it, beforeEach, expect } from 'vitest';

describe('ClientsListComponent - Bug Condition Exploration Tests', () => {
  let component: ClientsListComponent;
  let fixture: ComponentFixture<ClientsListComponent>;

  const mockClients: Client[] = [
    {
      id: 1,
      nombre_contacto: 'Juan Pérez',
      telefono_contacto: '555-1234',
      email_contacto: 'juan@example.com',
      nombre_local: 'Tienda Centro',
      direccion_local: 'Calle Principal 123',
      activo: true,
      fecha_registro: '2024-01-15',
    },
    {
      id: 2,
      nombre_contacto: 'María García',
      telefono_contacto: '555-5678',
      email_contacto: 'maria@example.com',
      nombre_local: 'Tienda Norte',
      direccion_local: 'Avenida Norte 456',
      activo: true,
      fecha_registro: '2024-02-20',
    },
  ];

  const mockApiResponse = {
    status: 200,
    data: mockClients,
    listErros: [],
  };

  beforeEach(async () => {
    const clientServiceMock = {
      getClients: vi.fn().mockReturnValue(of(mockApiResponse)),
      deleteClient: vi.fn(),
      createClient: vi.fn(),
      updateClient: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ClientsListComponent],
      providers: [{ provide: ClientService, useValue: clientServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Bug Condition: Modal Opens on Action Button Click', () => {
    /**
     * **Validates: Requirements 2.2, 2.4, 2.5**
     *
     * This test explores the bug condition where clicking action buttons
     * (Add Client, Edit Client) should open a modal with an appropriate form.
     * In unfixed code, these tests MUST FAIL because the event handlers are not connected.
     */

    it('Test Case 1: Should open modal with empty form when "Nuevo Cliente" button is clicked', () => {
      // Arrange
      const addButton = fixture.debugElement.query(By.css('button'));
      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent).toContain('Nuevo Cliente');

      // Act
      addButton.nativeElement.click();
      fixture.detectChanges();

      // Assert
      // The modal should be open
      const modal = fixture.debugElement.query(By.css('app-modal'));
      expect(modal).toBeTruthy();

      // The form component should be rendered inside the modal
      const formComponent = fixture.debugElement.query(By.css('app-client-form'));
      expect(formComponent).toBeTruthy();

      // The form should be in create mode (empty form)
      const formElement = formComponent.componentInstance;
      expect(formElement.isEditMode).toBeFalsy();
      expect(formElement.formData).toEqual(null);
    });

    it('Test Case 2: Should open modal with pre-populated data when "Editar" button is clicked on client row', () => {
      // Arrange
      const editButtons = fixture.debugElement.queryAll(By.css('button'));
      const editButton = editButtons.find((btn) => btn.nativeElement.textContent.trim() === 'Editar');
      expect(editButton).toBeTruthy();

      const clientToEdit = mockClients[0];

      // Act
      editButton?.nativeElement.click();
      fixture.detectChanges();

      // Assert
      // The modal should be open
      const modal = fixture.debugElement.query(By.css('app-modal'));
      expect(modal).toBeTruthy();

      // The form component should be rendered inside the modal
      const formComponent = fixture.debugElement.query(By.css('app-client-form'));
      expect(formComponent).toBeTruthy();

      // The form should be in edit mode with pre-populated data
      const formElement = formComponent.componentInstance;
      expect(formElement.isEditMode).toBeTruthy();
      expect(formElement.formData).toEqual(clientToEdit);
    });

    it('Test Case 3: Should verify modalIsOpen signal is true after "Nuevo Cliente" click', () => {
      // Arrange
      const addButton = fixture.debugElement.query(By.css('button'));

      // Act
      addButton.nativeElement.click();
      fixture.detectChanges();

      // Assert
      // Component should have a modalIsOpen signal that is true
      expect((component as any)['modalIsOpen']).toBeDefined();
      expect((component as any)['modalIsOpen']()).toBe(true);
    });

    it('Test Case 4: Should verify form component is rendered and accessible after edit button click', () => {
      // Arrange
      const editButtons = fixture.debugElement.queryAll(By.css('button'));
      const editButton = editButtons.find((btn) => btn.nativeElement.textContent.trim() === 'Editar');

      // Act
      editButton?.nativeElement.click();
      fixture.detectChanges();

      // Assert
      // Modal should be visible
      const modal = fixture.debugElement.query(By.css('app-modal'));
      expect(modal).toBeTruthy();

      // Form should be rendered
      const form = fixture.debugElement.query(By.css('app-client-form'));
      expect(form).toBeTruthy();

      // Form should have the correct client data
      const formInstance = form.componentInstance;
      expect(formInstance.client).toEqual(mockClients[0]);
    });
  });
});
