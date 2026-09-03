import type {
    Product,
    ProductInput,
    ProductListParams,
    ProductListResponse,
} from '../types/product';

const API_URL = 'http://localhost:3001';

export const getProducts = async (
    params: ProductListParams
): Promise<ProductListResponse> => {
    const searchParams = new URLSearchParams({
        _page: String(params.page),
        _limit: String(params.limit),
    });

    if (params.search?.trim()) {
        searchParams.set('nome_like', params.search.trim());
    }

    if (params.categoria) {
        searchParams.set('categoria', params.categoria);
    }

    const response = await fetch(
        `${API_URL}/produtos?${searchParams.toString()}`
    );

    if (!response.ok) {
        throw new Error('Não foi possível carregar os produtos.');
    }

    const products: Product[] = await response.json();
    const total = Number(response.headers.get('X-Total-Count') ?? 0);

    return {
        products,
        total,
    };
};

export const getProductById = async (id: number): Promise<Product> => {
    const response = await fetch(`${API_URL}/produtos/${id}`);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Produto não encontrado.');
        }

        throw new Error('Não foi possível carregar o produto.');
    }

    return response.json();
};

export const createProduct = async (
    product: ProductInput
): Promise<Product> => {
    const response = await fetch(`${API_URL}/produtos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        throw new Error('Não foi possível criar o produto.');
    }

    return response.json();
};

export const updateProduct = async (
    id: number,
    product: ProductInput
): Promise<Product> => {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Produto não encontrado.');
        }

        throw new Error('Não foi possível atualizar o produto.');
    }

    return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Produto não encontrado.');
        }

        throw new Error('Não foi possível excluir o produto.');
    }
};