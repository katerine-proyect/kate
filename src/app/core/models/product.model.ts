export interface Product {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    activo: boolean;
    lleva_inventario: boolean;
    stock_actual: number;
    categoria_nombre?: string;
    categoria_id?: number;
}

export interface ApiResponse<T> {
    status: number;
    data: T;
    pagination?: {
        total_count: number;
        total_pages: number;
        current_page: number;
        has_next: boolean;
        has_previous: boolean;
    };
    listErros: string[];
}
