import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ApiResponse } from '../../../core/models/product.model';
import { CategoryFormComponent } from '../../../shared/components/forms/category-form.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, CategoryFormComponent],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
})
export class CategoriesListComponent implements OnInit {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  modalIsOpen = signal(false);
  modalTitle = signal('');
  selectedCategory = signal<Category | null>(null);
  isEditMode = signal(false);
  isSubmittingForm = signal(false);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar categorías');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que deseas desactivar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.loadCategories();
        },
        error: (err) => {
          alert('Error al desactivar la categoría');
          console.error(err);
        }
      });
    }
  }

  onAddCategory(): void {
    this.isEditMode.set(false);
    this.selectedCategory.set(null);
    this.modalTitle.set('Crear Nueva Categoría');
    this.modalIsOpen.set(true);
  }

  onEditCategory(category: Category): void {
    this.isEditMode.set(true);
    this.selectedCategory.set(category);
    this.modalTitle.set('Editar Categoría');
    this.modalIsOpen.set(true);
  }

  closeModal(): void {
    this.modalIsOpen.set(false);
    this.selectedCategory.set(null);
    this.isEditMode.set(false);
  }

  onCategoryFormSubmit(formData: Partial<Category>): void {
    this.isSubmittingForm.set(true);
    const request: Observable<ApiResponse<any>> = this.isEditMode() && this.selectedCategory()?.id
      ? this.categoryService.updateCategory(this.selectedCategory()!.id, formData)
      : this.categoryService.createCategory(formData);

    request.subscribe({
      next: (response: ApiResponse<any>) => {
        if (response.status === 200) {
          this.loadCategories();
          this.closeModal();
          this.isSubmittingForm.set(false);
        } else {
          alert('Error: ' + response.listErros.join(', '));
          this.isSubmittingForm.set(false);
        }
      },
      error: (err) => {
        alert('Error al guardar la categoría');
        console.error(err);
        this.isSubmittingForm.set(false);
      }
    });
  }

  onFormCancel(): void {
    this.closeModal();
  }
}
