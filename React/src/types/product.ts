export interface Product {
    id: number;
    nome: string;
    categoria: string;
    preco: number;
    estoque: number;
    ativo: boolean;
}

export type ProductInput = Omit<Product, 'id'>;

export interface ProductListParams {
    page: number;
    limit: number;
    search?: string;
    categoria?: string;
}

export interface ProductListResponse {
    products: Product[];
    total: number;
}