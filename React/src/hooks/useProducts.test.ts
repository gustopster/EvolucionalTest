import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useProducts } from './useProducts';
import * as productService from '../services/productService';

vi.mock('../services/productService', () => ({
    getProducts: vi.fn(),
}));

const products = [{ id: 1, nome: 'Teclado', categoria: 'Perifericos', preco: 100, estoque: 10, ativo: true }];

describe('useProducts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
        vi.mocked(productService.getProducts).mockResolvedValue({ products, total: 1 });
    });

    it('carrega produtos inicialmente', async () => {
        const { result } = renderHook(() => useProducts());

        await waitFor(() => expect(result.current.initialLoading).toBe(false), { timeout: 3000 });
        expect(result.current.products).toEqual(products);
        expect(result.current.total).toBe(1);
    });

    it('atualiza o termo de busca', async () => {
        const { result } = renderHook(() => useProducts());

        await waitFor(() => expect(result.current.initialLoading).toBe(false), { timeout: 3000 });
        act(() => result.current.setSearchInput('teclado'));

        expect(result.current.searchInput).toBe('teclado');
    });

    it('atualiza a categoria', async () => {
        const { result } = renderHook(() => useProducts());

        await waitFor(() => expect(result.current.initialLoading).toBe(false), { timeout: 3000 });
        act(() => result.current.setCategoria('Perifericos'));

        expect(result.current.categoria).toBe('Perifericos');
    });
});
