import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductFormPage } from './ProductFormPage';
import * as productService from '../../services/productService';

vi.mock('../../services/productService', () => ({
    createProduct: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
}));

const renderPage = (path = '/produtos/novo') => render(
    <MemoryRouter initialEntries={[path]}>
        <Routes>
            <Route path="/produtos/novo" element={<ProductFormPage />} />
            <Route path="/produtos/:id/editar" element={<ProductFormPage />} />
            <Route path="*" element={<div>Destino</div>} />
        </Routes>
    </MemoryRouter>
);

describe('ProductFormPage', () => {
    beforeEach(() => vi.clearAllMocks());

    it('exibe erros para campos inválidos', async () => {
        renderPage();
        fireEvent.click(screen.getByRole('button', { name: 'Cadastrar produto' }));

        expect(screen.getByText('O nome é obrigatório.')).toBeInTheDocument();
        expect(screen.getByText('A categoria é obrigatória.')).toBeInTheDocument();
        expect(screen.getByText('O preço deve ser maior que zero.')).toBeInTheDocument();
    });

    it('valida nome com menos de três caracteres', () => {
        renderPage();
        fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'AB' } });
        fireEvent.click(screen.getByRole('button', { name: 'Cadastrar produto' }));

        expect(screen.getByText('O nome deve ter pelo menos 3 caracteres.')).toBeInTheDocument();
    });

    it('cria um produto válido', async () => {
        vi.mocked(productService.createProduct).mockResolvedValue({ id: 23, nome: 'Teclado', categoria: 'Perifericos', preco: 100, estoque: 5, ativo: true });
        renderPage();

        fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teclado' } });
        fireEvent.change(screen.getByLabelText('Categoria'), { target: { value: 'Perifericos' } });
        fireEvent.change(screen.getByLabelText('Preço'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Estoque'), { target: { value: '5' } });
        fireEvent.click(screen.getByRole('button', { name: 'Cadastrar produto' }));

        await waitFor(() => expect(productService.createProduct).toHaveBeenCalledWith({ nome: 'Teclado', categoria: 'Perifericos', preco: 100, estoque: 5, ativo: true }));
        expect(screen.getByText('Produto criado com sucesso.')).toBeInTheDocument();
    });

    it('carrega dados no modo de edição', async () => {
        vi.mocked(productService.getProductById).mockResolvedValue({ id: 1, nome: 'Teclado', categoria: 'Perifericos', preco: 349.9, estoque: 15, ativo: true });
        renderPage('/produtos/1/editar');

        await waitFor(() => expect(screen.getByLabelText('Nome')).toHaveValue('Teclado'));
        expect(screen.getByRole('heading', { name: 'Editar produto' })).toBeInTheDocument();
    });
});
