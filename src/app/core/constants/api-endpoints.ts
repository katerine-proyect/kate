import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/usuarios/login/`,
  },
  PRODUCTS: {
    BASE: `${API_BASE_URL}/productos/`,
    DETAIL: (id: number) => `${API_BASE_URL}/productos/${id}/`,
    DELETE: (id: number) => `${API_BASE_URL}/productos/${id}/eliminar/`,
  },
  INVENTORY: {
    MOVIMIENTO: `${API_BASE_URL}/productos/inventario/movimiento/`,
  },
  CLIENTS: {
    BASE: `${API_BASE_URL}/clientes/`,
    DETAIL: (id: number) => `${API_BASE_URL}/clientes/${id}/`,
    DELETE: (id: number) => `${API_BASE_URL}/clientes/${id}/eliminar/`,
  },
  SALES: {
    BASE: `${API_BASE_URL}/pedidos/`,
    DETAIL: (id: number) => `${API_BASE_URL}/pedidos/${id}/`,
    STATS: `${API_BASE_URL}/pedidos/stats/`,
  },
  CATEGORIES: {
    BASE: `${API_BASE_URL}/productos/categorias/`,
    DETAIL: (id: number) => `${API_BASE_URL}/productos/categorias/${id}/`,
    DELETE: (id: number) => `${API_BASE_URL}/productos/categorias/${id}/eliminar/`,
  },
  USERS: {
    BASE: `${API_BASE_URL}/usuarios/`,
    LIST: `${API_BASE_URL}/usuarios/listar/`,
    CREATE: `${API_BASE_URL}/usuarios/crear/`,
    DETAIL: (id: number) => `${API_BASE_URL}/usuarios/${id}/`,
    UPDATE: (id: number) => `${API_BASE_URL}/usuarios/${id}/actualizar/`,
    TOGGLE_STATUS: (id: number) => `${API_BASE_URL}/usuarios/${id}/cambiar-estado/`,
    ROLES: `${API_BASE_URL}/usuarios/roles/`,
  }
};
