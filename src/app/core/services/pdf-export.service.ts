import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Order } from '../models/order.model';
import { formatDate, CurrencyPipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PdfExportService {
  private currencyPipe = new CurrencyPipe('en-US');

  exportOrderInvoice(order: Order): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header with Logo
    const logoUrl = 'logo-casa-ideal.png';
    doc.addImage(logoUrl, 'PNG', 14, 10, 25, 25);
    
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('Distribuidora casa ideal', 42, 18);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('NIT: 1143444437', 42, 24);
    
    doc.text(`Fecha: ${formatDate(new Date(), 'dd/MM/yyyy HH:mm', 'en-US')}`, pageWidth - 14, 18, { align: 'right' });

    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(14, 38, pageWidth - 14, 38);

    // Order Info
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Pedido: #${order.numero_pedido}`, 14, 48);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    var cliente_nombre = "";
    if (order.cliente) {
      cliente_nombre = order.cliente.nombre + " " + order.cliente.apellido;
    } else {
      cliente_nombre = "Venta Directa";
    }
    doc.text(`Cliente: ${cliente_nombre}`, 14, 56);
    if (order?.direccion_envio) {
      doc.text(`Dirección: ${order.direccion_envio}`, 14, 62);
    }
    doc.text(`Vendedor: ${order?.vendedor ? order.vendedor : 'Sistema'}`, 14, 68);

    // Table
    const tableData = (order.items || []).map(item => [
      item.producto_nombre || 'Producto',
      item.cantidad,
      this.currencyPipe.transform(item.precio_unitario) || `$${item.precio_unitario}`,
      this.currencyPipe.transform((item.cantidad * item.precio_unitario)) || `$${(item.cantidad * item.precio_unitario)}`
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] }, // Primary color
      margin: { left: 14, right: 14 },
    });

    // Totals
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: ${this.currencyPipe.transform(order.total) || `$${order.total}`}`, pageWidth - 14, finalY, { align: 'right' });

    if (order.notas) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      doc.text('Notas:', 14, finalY + 10);
      doc.text(order.notas, 14, finalY + 16, { maxWidth: pageWidth - 28 });
    }

    // Save
    doc.save(`Factura_${order.numero_pedido}.pdf`);
  }
}
