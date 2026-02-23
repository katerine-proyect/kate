import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaleService } from '../../../core/services/sale.service';
import { ClientService } from '../../../core/services/client.service';
import { Order } from '../../../core/models/order.model';
import { ApiResponse } from '../../../core/models/product.model';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-dashboard.component.html',
  styleUrl: './sales-dashboard.component.css',
})
export class SalesDashboardComponent implements OnInit {
  private saleService = inject(SaleService);
  
  recentSales = signal<Order[]>([]);
  currentPage = signal(1);
  pageSize = signal(10);
  paginationInfo = signal<ApiResponse<Order[]>['pagination'] | undefined>(undefined);

  stats = signal({
    total_ventas: 0,
    pedidos_hoy: 0,
    clientes_activos: 0
  });
  
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

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
      error: () => this.handleError()
    });
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
      error: () => this.handleError()
    });
  }

  nextPage(): void {
    if (this.paginationInfo()?.has_next) {
      this.currentPage.update(p => p + 1);
      this.loadSales();
    }
  }

  previousPage(): void {
    if (this.paginationInfo()?.has_previous) {
      this.currentPage.update(p => p - 1);
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
