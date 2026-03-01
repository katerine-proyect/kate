import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsListComponent } from './products-list.component';
import { ProductService } from '../../../core/services/product.service';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { Product, ApiResponse } from '../../../core/models/product.model';
import { By } from '@angular/platform-browser';
import { describe, it, beforeEach, expect } from 'vitest';

describe('ProductsListComponent - Bug Condition Exploration Tests', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  const mockProducts: Product[] = [
    {
      id: 1,
      nombre: 'Producto 1',
      descripcion: 'Descripción 1',
      precio: 100,
      activo: true,
      lleva_inventario: true,
      stock_actual: 50,
      categoria_nombre: 'Categoría 1',
      categoria_id: 1,
    },
    {
      id: 2,
      nombre: 'Producto 2',
      descripcion: 'Descripción 2',
      precio: 200,
      activo: true,
      lleva_inventario: true,
      stock_actual: 30,
      categoria_nombre: 'Categoría 2',
      categoria_id: 2,
    },
  ];

  const mockApiResponse: ApiResponse<Product[]> = {
    status: 200,
    data: mockProducts,
    listErros: [],
  };

  beforeEach(async () => {
    const productServiceMock = {
      getProducts: vi.fn().mockReturnValue(of(mockApiResponse)),
      deleteProduct: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductsListComponent],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Bug Condition: Modal Opens on Action Button Click', () => {
    /**
     * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
     *
     * This test explores the bug condition where clicking action buttons
     * (Add Product, Edit Product) should open a modal with an appropriate form.
     * In unfixed code, these tests MUST FAIL because the event handlers are not connected.
     */

    it('Test Case 1: Should open modal with empty form when "Añadir Producto" button is clicked', () => {
      // Arrange
      const addButton = fixture.debugElement.query(By.css('button:not([class*="border"])'));
      expect(addButton).toBeTruthy();
      expect(addButton.nativeElement.textContent).toContain('Añadir Producto');

      // Act
      addButton.nativeElement.click();
      fixture.detectChanges();

      // Assert
      // The modal should be open
      const modal = fixture.debugElement.query(By.css('app-modal'));
      expect(modal).toBeTruthy();

      // The form component should be rendered inside the modal
      const formComponent = fixture.debugElement.query(By.css('app-product-form'));
      expect(formComponent).toBeTruthy();

      // The form should be in create mode (empty form)
      const formElement = formComponent.componentInstance;
      expect(formElement.isEditMode).toBeFalsy();
      expect(formElement.formData).toEqual(null);
    });

    it('Test Case 2: Should open modal with pre-populated data when "Editar" button is clicked on product row', () => {
      // Arrange
      const editButtons = fixture.debugElement.queryAll(By.css('button'));
      const editButton = editButtons.find((btn) => btn.nativeElement.textContent.trim() === 'Editar');
      expect(editButton).toBeTruthy();

      const productToEdit = mockProducts[0];

      // Act
      editButton?.nativeElement.click();
      fixture.detectChanges();

      // Assert
      // The modal should be open
      const modal = fixture.debugElement.query(By.css('app-modal'));
      expect(modal).toBeTruthy();

      // The form component should be rendered inside the modal
      const formComponent = fixture.debugElement.query(By.css('app-product-form'));
      expect(formComponent).toBeTruthy();

      // The form should be in edit mode with pre-populated data
      const formElement = formComponent.componentInstance;
      expect(formElement.isEditMode).toBeTruthy();
      expect(formElement.formData).toEqual(productToEdit);
    });

    it('Test Case 3: Should verify modalIsOpen signal is true after "Añadir Producto" click', () => {
      // Arrange
      const addButton = fixture.debugElement.query(By.css('button:not([class*="border"])'));

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
      const form = fixture.debugElement.query(By.css('app-product-form'));
      expect(form).toBeTruthy();

      // Form should have the correct product data
      const formInstance = form.componentInstance;
      expect(formInstance.product).toEqual(mockProducts[0]);
    });
  });
});
