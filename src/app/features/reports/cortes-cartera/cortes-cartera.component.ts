import { Component, inject, OnInit, signal, computed, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../core/services/client.service';
import { ReportsService, CortesResponse, Order } from '../../../core/services/reports.service';
import { Client } from '../../../core/models/client.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-cortes-cartera',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cortes-cartera.component.html',
  styleUrl: './cortes-cartera.component.css'
})
export class CortesCarteraComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private clientService = inject(ClientService);
  private reportsService = inject(ReportsService);
  private cdr = inject(ChangeDetectorRef);

  // Datos
  clientes = signal<Client[]>([]);
  datosCortes = signal<CortesResponse | null>(null);
  chart: Chart | null = null;

  // Filtros
  fechaInicio = signal<string>('');
  fechaFin = signal<string>('');
  clienteSeleccionado = signal<number | null>(null);

  // Estado
  cargando = signal<boolean>(false);
  error = signal<string>('');

  // Contadores computados
  totalPedidos = computed(() => this.datosCortes()?.estadisticas.total_pedidos ?? 0);
  cantidadProductos = computed(() => this.datosCortes()?.estadisticas.cantidad_productos ?? 0);
  totalPagado = computed(() => this.datosCortes()?.estadisticas.total_pagado ?? 0);
  totalNoPagado = computed(() => this.datosCortes()?.estadisticas.total_no_pagado ?? 0);
  pedidos = computed(() => this.datosCortes()?.pedidos ?? []);

  ngOnInit(): void {
    this.cargarClientes();
    this.inicializarFechas();
  }

  ngAfterViewInit(): void {
    // Chart se inicializa cuando hay datos
  }

  cargarClientes(): void {
    this.clientService.getClients().subscribe({
      next: (res) => {
        if (res.status === 200 && res.data) {
          this.clientes.set(res.data);
        }
      },
      error: () => {
        this.error.set('Error al cargar clientes');
      }
    });
  }

  inicializarFechas(): void {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);

    this.fechaFin.set(hoy.toISOString().split('T')[0]);
    this.fechaInicio.set(hace30Dias.toISOString().split('T')[0]);
  }

  cargarCortes(): void {
    if (!this.fechaInicio() || !this.fechaFin()) {
      this.error.set('Seleccioná las fechas de inicio y fin');
      return;
    }

    this.cargando.set(true);
    this.error.set('');

    const clienteId = this.clienteSeleccionado() ?? undefined;

    this.reportsService.getCortes(this.fechaInicio(), this.fechaFin(), clienteId).subscribe({
      next: (res) => {
        this.cargando.set(false);
        if (res.status === 200) {
          this.datosCortes.set(res.data);
          this.actualizarGrafico();
        } else {
          this.error.set(res.listErros?.[0] ?? 'Error desconocido');
        }
      },
      error: (err) => {
        this.cargando.set(false);
        this.error.set('Error al cargar los datos: ' + (err.message ?? 'Error de conexión'));
      }
    });
  }

  actualizarGrafico(): void {
    // Intentar hasta 3 veces con delay incremental
    this.reintentarGrafico(0);
  }

  private reintentarGrafico(intento: number): void {
    const maxIntentos = 3;
    const delays = [50, 150, 300];

    setTimeout(() => {
      const canvas = document.querySelector('#chartCanvas') as HTMLCanvasElement;
      
      if (canvas) {
        // Guardar referencia directa al canvas
        this.actualizarGraficoConCanvas(canvas);
      } else if (intento < maxIntentos - 1) {
        this.reintentarGrafico(intento + 1);
      } else {
        console.log('No se encontró el canvas después de', maxIntentos, 'intentos');
      }
    }, delays[intento] || 100);
  }

  private actualizarGraficoConCanvas(canvas: HTMLCanvasElement): void {
    if (!this.datosCortes()) return;

    const pedidos = this.pedidos();
    if (pedidos.length === 0) return;

    // Determinar granularidad según el rango de fechas
    const inicio = new Date(this.fechaInicio());
    const fin = new Date(this.fechaFin());
    const diasDiff = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

    let labels: string[];
    let data: number[];

    if (diasDiff <= 31) {
      // Por día
      const pedidosPorDia = this.agruparPorDia(pedidos);
      labels = Object.keys(pedidosPorDia).sort();
      data = labels.map(l => pedidosPorDia[l]);
    } else if (diasDiff <= 180) {
      // Por semana
      const pedidosPorSemana = this.agruparPorSemana(pedidos);
      labels = Object.keys(pedidosPorSemana).sort();
      data = labels.map(l => pedidosPorSemana[l]);
    } else {
      // Por mes
      const pedidosPorMes = this.agruparPorMes(pedidos);
      labels = Object.keys(pedidosPorMes).sort();
      data = labels.map(l => pedidosPorMes[l]);
    }

    // Si solo hay un punto de datos, agregar un punto adicional al final
    // para que Chart.js renderice correctamente la línea
    if (labels.length === 1) {
      const unicaFecha = labels[0];
      // Agregar un punto en la misma fecha o siguiente día
      let fechaExtra: string;
      if (diasDiff <= 31) {
        const fecha = new Date(unicaFecha);
        fecha.setDate(fecha.getDate() + 1);
        fechaExtra = fecha.toISOString().split('T')[0];
      } else if (diasDiff <= 180) {
        // Para semana, agregar la misma semana
        fechaExtra = unicaFecha;
      } else {
        // Para mes, agregar el mismo mes
        fechaExtra = unicaFecha;
      }
      labels.push(fechaExtra);
      data.push(0); // Agregar 0 pedidos para el punto extra
    }

    // Destruir chart anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    // Crear nuevo chart con el canvas recibido
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Pedidos',
          data,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  private agruparPorDia(pedidos: Order[]): Record<string, number> {
    const agrupado: Record<string, number> = {};
    pedidos.forEach(p => {
      const fecha = new Date(p.fecha_creacion).toISOString().split('T')[0];
      agrupado[fecha] = (agrupado[fecha] || 0) + 1;
    });
    return agrupado;
  }

  private agruparPorSemana(pedidos: Order[]): Record<string, number> {
    const agrupado: Record<string, number> = {};
    pedidos.forEach(p => {
      const fecha = new Date(p.fecha_creacion);
      const semana = this.getSemana(fecha);
      agrupado[semana] = (agrupado[semana] || 0) + 1;
    });
    return agrupado;
  }

  private agruparPorMes(pedidos: Order[]): Record<string, number> {
    const agrupado: Record<string, number> = {};
    pedidos.forEach(p => {
      const fecha = new Date(p.fecha_creacion);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      agrupado[mes] = (agrupado[mes] || 0) + 1;
    });
    return agrupado;
  }

  private getSemana(fecha: Date): string {
    const inicioAnio = new Date(fecha.getFullYear(), 0, 1);
    const dias = Math.floor((fecha.getTime() - inicioAnio.getTime()) / (24 * 60 * 60 * 1000));
    const semana = Math.ceil((dias + inicioAnio.getDay() + 1) / 7);
    return `${fecha.getFullYear()}-S${String(semana).padStart(2, '0')}`;
  }

  getLabelCliente(): string {
    if (!this.clienteSeleccionado()) return 'Todos los clientes';
    const cliente = this.clientes().find(c => c.id === this.clienteSeleccionado());
    return cliente?.nombre_local ?? 'Cliente desconocido';
  }

  // Función para exportar a Excel
  exportarExcel(): void {
    if (!this.datosCortes()) return;

    const Pedidos = this.pedidos();
    const wsData: any[] = [];

    // Agregar encabezados
    wsData.push([
      'Número de Pedido',
      'Cliente',
      'Vendedor',
      'Total',
      'Estado',
      'Fecha de Creación',
      'Productos'
    ]);

    // Agregar datos de cada pedido
    Pedidos.forEach(p => {
      const productos = p.items.map(i => `${i.cantidad} x ${i.producto_nombre}`).join(', ');
      wsData.push([
        p.numero_pedido,
        p.cliente?.nombre ?? 'Venta Directa',
        p.vendedor,
        p.total,
        p.estado,
        new Date(p.fecha_creacion).toLocaleDateString(),
        productos
      ]);
    });

    // Import dinámico de xlsx
    import('xlsx').then(XLSX => {
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Cortes de Cartera');

      // Generar nombre de archivo con las fechas
      const nombreArchivo = `corte-cartera-${this.fechaInicio()}-a-${this.fechaFin()}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);
    });
  }

  limpiarFiltros(): void {
    this.inicializarFechas();
    this.clienteSeleccionado.set(null);
    this.datosCortes.set(null);
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}