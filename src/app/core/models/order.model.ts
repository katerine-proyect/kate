export interface OrderItem {
  id?: number;
  producto_id: number;
  producto_nombre?: string;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Order {
  id?: number;
  numero_pedido: string;
  cliente?: 
  {
    id?: string;
    nombre?: string;
    apellido?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
  };
  vendedor?: string;
  total: number;
  estado: string;
  notas?: string;
  direccion_envio?: string;
  fecha_creacion?: string;
  items?: OrderItem[];
}
