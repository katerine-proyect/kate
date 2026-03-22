import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../../core/services/sale.service';
import { ClientService } from '../../../core/services/client.service';
import { Order } from '../../../core/models/order.model';
import { ApiResponse } from '../../../core/models/product.model';

import { SaleFormComponent } from '../sale-form/sale-form.component';

import { PdfExportService } from '../../../core/services/pdf-export.service';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule, SaleFormComponent],
  templateUrl: './sales-dashboard.component.html',
  styleUrl: './sales-dashboard.component.css',
})
export class SalesDashboardComponent implements OnInit {
  private saleService = inject(SaleService);
  private pdfService = inject(PdfExportService);

  recentSales = signal<Order[]>([]);
  currentPage = signal(1);
  pageSize = signal(10);
  paginationInfo = signal<ApiResponse<Order[]>['pagination'] | undefined>(undefined);

  stats = signal({
    total_ventas: 0,
    pedidos_hoy: 0,
    clientes_activos: 0,
  });

  isLoading = signal(false);
  showSaleForm = signal(false);
  errorMessage = signal<string | null>(null);
  selectedSaleId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);

    // Fetch paginated Sales
    this.loadSales();

    // Fetch Pre-calculated Stats from Backend
    this.saleService.getDashboardStats().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.stats.set(response.data);
        }
      },
      error: () => this.handleError(),
    });
  }

  openSaleForm(): void {
    this.showSaleForm.set(true);
    this.selectedSaleId.set(null);
  }

  openEditModal(id: number): void {
    this.selectedSaleId.set(id);
    this.showSaleForm.set(true);
  }

  onSaleFormClosed(success: boolean): void {
    this.showSaleForm.set(false);
    this.selectedSaleId.set(null);
    if (success) {
      this.loadDashboardData();
    }
  }

  async downloadPDF(sale: Order): Promise<void> {
    if (!sale.items) {
      // If items not loaded, fetch detail
      this.isLoading.set(true);
      this.saleService.getSale(sale.id!).subscribe({
        next: async (response) => {
          if (response.status === 200) {
            await this.pdfService.exportOrderInvoice(response.data);
          }
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Error al cargar detalle para PDF');
          this.isLoading.set(false);
        },
      });
    } else {
      await this.pdfService.exportOrderInvoice(sale);
    }
  }

  loadSales(): void {
    this.isLoading.set(true);
    this.saleService.getSales(this.currentPage(), this.pageSize()).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.recentSales.set(response.data);
          this.paginationInfo.set(response.pagination);
        }
        this.isLoading.set(false);
      },
      error: () => this.handleError(),
    });
  }

  nextPage(): void {
    if (this.paginationInfo()?.has_next) {
      this.currentPage.update((p) => p + 1);
      this.loadSales();
    }
  }

  previousPage(): void {
    if (this.paginationInfo()?.has_previous) {
      this.currentPage.update((p) => p - 1);
      this.loadSales();
    }
  }

  private checkLoadingState(): void {
    this.isLoading.set(false);
  }

  private handleError(): void {
    this.errorMessage.set('Error al cargar datos del tablero');
    this.isLoading.set(false);
  }
}
