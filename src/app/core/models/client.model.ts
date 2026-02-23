export interface Client {
  id?: number;
  nombre_contacto: string;
  telefono_contacto: string;
  email_contacto: string;
  nombre_local: string;
  direccion_local: string;
  activo: boolean;
  fecha_registro?: string;
}
