import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product, ApiResponse } from '../../../core/models/product.model';
import { ProductFormComponent } from '../../../shared/components/forms/product-form.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
})
export class ProductsListComponent implements OnInit {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  modalIsOpen = signal(false);
  modalTitle = signal('');
  selectedProduct = signal<Product | null>(null);
  isEditMode = signal(false);
  isSubmittingForm = signal(false);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar productos');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas desactivar este producto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts(); // Reload to show updated status
        },
        error: (err) => {
          alert('Error al desactivar el producto');
          console.error(err);
        }
      });
    }
  }

  onAddProduct(): void {
    this.isEditMode.set(false);
    this.selectedProduct.set(null);
    this.modalTitle.set('Crear Nuevo Producto');
    this.modalIsOpen.set(true);
  }

  onEditProduct(product: Product): void {
    this.isEditMode.set(true);
    this.selectedProduct.set(product);
    this.modalTitle.set('Editar Producto');
    this.modalIsOpen.set(true);
  }

  closeModal(): void {
    this.modalIsOpen.set(false);
    this.selectedProduct.set(null);
    this.isEditMode.set(false);
  }

  onProductFormSubmit(formData: Partial<Product>): void {
    this.isSubmittingForm.set(true);
    const request: Observable<ApiResponse<any>> = this.isEditMode() && this.selectedProduct()?.id
      ? this.productService.updateProduct(this.selectedProduct()!.id, formData)
      : this.productService.createProduct(formData);

    request.subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.status === 200) {
          this.loadProducts();
          this.closeModal();
          this.isSubmittingForm.set(false);
        } else {
          alert('Error: ' + response.listErros.join(', '));
          this.isSubmittingForm.set(false);
        }
      },
      error: (err) => {
        alert('Error al guardar el producto');
        console.error(err);
        this.isSubmittingForm.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.closeModal();
  }
}
