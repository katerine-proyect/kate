import { Component, EventEmitter, OnInit, Output, Input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { SaleService } from '../../../core/services/sale.service';
import { ProductService } from '../../../core/services/product.service';
import { ClientService } from '../../../core/services/client.service';
import { Product } from '../../../core/models/product.model';
import { Client } from '../../../core/models/client.model';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-sale-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sale-form.component.html',
  styleUrl: './sale-form.component.css'
})
export class SaleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private saleService = inject(SaleService);
  private productService = inject(ProductService);
  private clientService = inject(ClientService);

  @Input() saleId: number | null = null;
  @Output() closed = new EventEmitter<boolean>();

  saleForm: FormGroup;
  products = signal<Product[]>([]);
  clients = signal<Client[]>([]);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.saleForm = this.fb.group({
      cliente_id: [null],
      direccion_envio: [''],
      notas: [''],
      estado: [null],
      items: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadClients();
    
    if (this.saleId) {
      this.loadSaleData(this.saleId);
    } else {
      this.addItem(); // Start with one item only for new sales
    }
  }

  loadSaleData(id: number): void {
    this.saleService.getSale(id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          const sale = response.data;
          this.saleForm.patchValue({
            cliente_id: sale.cliente?.id || null,
            direccion_envio: sale.direccion_envio || '',
            notas: sale.notas || '',
            estado: sale.estado
          });

          // Clear items array and load existing items
          while (this.items.length) {
            this.items.removeAt(0);
          }

          sale.items?.forEach(item => {
            const product = this.products().find(p => p.nombre === item.producto_nombre);
            const itemForm = this.fb.group({
              producto_id: [product?.id || null, Validators.required],
              cantidad: [item.cantidad, [Validators.required, Validators.min(1)]],
              precio_unitario: [item.precio_unitario, [Validators.required, Validators.min(0)]],
              stock_max: [product?.lleva_inventario ? product.stock_actual + item.cantidad : 999999]
            });
            this.items.push(itemForm);
          });
        }
      },
      error: () => this.errorMessage.set('Error al cargar los datos del pedido')
    });
  }

  get items() {
    return this.saleForm.get('items') as FormArray;
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.products.set(response.data.filter(p => p.activo));
        }
      }
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.clients.set(response.data);
        }
      }
    });
  }

  addItem(): void {
    const itemForm = this.fb.group({
      producto_id: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precio_unitario: [0, [Validators.required, Validators.min(0)]],
      stock_max: [0]
    });

    this.items.push(itemForm);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    if (this.items.length === 0) {
      this.addItem();
    }
  }

  onProductChange(index: number): void {
    const item = this.items.at(index);
    const productId = item.get('producto_id')?.value;
    const product = this.products().find(p => p.id === productId);

    if (product) {
      item.patchValue({
        precio_unitario: product.precio,
        stock_max: product.lleva_inventario ? product.stock_actual : 999999
      });
    }
  }

  getTotal(): number {
    return this.items.controls.reduce((total, control) => {
      const cantidad = control.get('cantidad')?.value || 0;
      const precio = control.get('precio_unitario')?.value || 0;
      return total + (cantidad * precio);
    }, 0);
  }

  onSubmit(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formData = this.saleForm.value;
    
    const request = this.saleId 
      ? this.saleService.updateSale(this.saleId, formData)
      : this.saleService.createSale(formData);

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
        this.errorMessage.set('Error al procesar la venta');
        this.isSubmitting.set(false);
      }
    });
  }

  close(): void {
    this.closed.emit(false);
  }
}
