export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  nombre: string;
  apellido?: string;
  telefono?: string;
  is_active: boolean;
  rol_id?: number;
  fecha_registro: string;
  ultimo_login?: string;
}
