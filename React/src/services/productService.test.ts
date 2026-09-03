import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from './productService';

const product = {
    id: 1,
    nome: 'Teclado Mecânico',
    categoria: 'Perifericos',
    preco: 349.9,
    estoque: 15,
    ativo: true,
};

describe('productService', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('consulta produtos com paginação, busca e categoria', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([product]), {
            status: 200,
            headers: { 'X-Total-Count': '22' },
        })));

        const result = await getProducts({ page: 2, limit: 10, search: ' teclado ', categoria: 'Perifericos' });

        expect(result).toEqual({ products: [product], total: 22 });
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/produtos?_page=2&_limit=10&nome_like=teclado&categoria=Perifericos');
    });

    it('consulta um produto por id', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(product), { status: 200 })));

        await expect(getProductById(1)).resolves.toEqual(product);
    });

    it('cria um produto', async () => {
        const input = { nome: 'Novo', categoria: 'Audio', preco: 100, estoque: 5, ativo: true };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...input, id: 23 }), { status: 201 })));

        await expect(createProduct(input)).resolves.toEqual({ ...input, id: 23 });
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/produtos', expect.objectContaining({ method: 'POST' }));
    });

    it('atualiza um produto', async () => {
        const input = { nome: 'Atualizado', categoria: 'Audio', preco: 120, estoque: 8, ativo: true };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ ...input, id: 1 }), { status: 200 })));

        await expect(updateProduct(1, input)).resolves.toEqual({ ...input, id: 1 });
        expect(fetch).toHaveBeenCalledWith('http://localhost:3001/produtos/1', expect.objectContaining({ method: 'PUT' }));
    });

    it('exclui um produto', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 200 })));

        await expect(deleteProduct(1)).resolves.toBeUndefined();
    });

    it('trata produto não encontrado', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })));

        await expect(getProductById(999)).rejects.toThrow('Produto não encontrado.');
    });
});
