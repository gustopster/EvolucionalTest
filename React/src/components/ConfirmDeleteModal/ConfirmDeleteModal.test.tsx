import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

describe('ConfirmDeleteModal', () => {
    it('exibe o produto e permite cancelar', () => {
        const onCancel = vi.fn();
        const onConfirm = vi.fn();
        render(<ConfirmDeleteModal productName="Teclado" onCancel={onCancel} onConfirm={onConfirm} />);

        expect(screen.getByText('Teclado')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('confirma a exclusão', () => {
        const onConfirm = vi.fn();
        render(<ConfirmDeleteModal productName="Teclado" onCancel={vi.fn()} onConfirm={onConfirm} />);

        fireEvent.click(screen.getByRole('button', { name: 'Excluir' }));
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});
