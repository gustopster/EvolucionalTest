import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductDetailsPage } from './ProductDetailsPage';
import * as productService from '../../services/productService';

vi.mock('../../services/productService', () => ({
    deleteProduct: vi.fn(),
    getProductById: vi.fn(),
}));

const product = { id: 1, nome: 'Teclado Mecânico', categoria: 'Perifericos', preco: 349.9, estoque: 15, ativo: true };

const renderPage = () => render(
    <MemoryRouter initialEntries={['/produtos/1']}>
        <Routes>
            <Route path="/produtos/:id" element={<ProductDetailsPage />} />
            <Route path="/produtos/:id/editar" element={<div>Edição</div>} />
            <Route path="/produtos" element={<div>Produtos</div>} />
        </Routes>
    </MemoryRouter>
);

describe('ProductDetailsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(productService.getProductById).mockResolvedValue(product);
    });

    it('carrega e exibe os dados do produto', async () => {
        renderPage();

        await waitFor(() => expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument());
        expect(screen.getByText('Perifericos')).toBeInTheDocument();
        expect(screen.getByText('Ativo')).toBeInTheDocument();
    });

    it('abre a confirmação de exclusão', async () => {
        renderPage();
        await waitFor(() => expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
        expect(screen.getByRole('heading', { name: 'Excluir produto?' })).toBeInTheDocument();
    });

    it('exclui o produto após confirmação', async () => {
        vi.mocked(productService.deleteProduct).mockResolvedValue(undefined);
        renderPage();
        await waitFor(() => expect(screen.getByText('Teclado Mecânico')).toBeInTheDocument());

        fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
        fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));

        await waitFor(() => expect(productService.deleteProduct).toHaveBeenCalledWith(1));
    });
});
