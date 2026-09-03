import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { ProductsPage } from './ProductsPage';

const navigate = vi.fn();
const setSearchInput = vi.fn();
const setCategoria = vi.fn();

vi.mock('../../hooks/useProducts', () => ({
    useProducts: () => ({
        products: [{ id: 1, nome: 'Teclado Mecânico', categoria: 'Perifericos', preco: 349.9, estoque: 15, ativo: true }],
        total: 1,
        initialLoading: false,
        loading: false,
        loadingMore: false,
        error: '',
        searchInput: '',
        categoria: '',
        loadMoreRef: { current: null },
        setSearchInput,
        setCategoria,
    }),
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
    return { ...actual, useNavigate: () => navigate };
});

describe('ProductsPage', () => {
    it('exibe produtos e permite navegar para novo produto', async () => {
        render(<MemoryRouter><ProductsPage /></MemoryRouter>);

        expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument();
        expect(screen.getByText('produto encontrado')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: '+ Novo produto' }));
        await waitFor(() => expect(navigate).toHaveBeenCalledWith('/produtos/novo'));
    });

    it('dispara alterações de busca e categoria', () => {
        render(<MemoryRouter><ProductsPage /></MemoryRouter>);

        fireEvent.change(screen.getByLabelText('Buscar produto'), { target: { value: 'teclado' } });
        fireEvent.change(screen.getByLabelText('Filtrar por categoria'), { target: { value: 'Perifericos' } });

        expect(setSearchInput).toHaveBeenCalledWith('teclado');
        expect(setCategoria).toHaveBeenCalledWith('Perifericos');
    });
});
