import { describe, expect, it, vi } from 'vitest';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import {
    fireEvent,
    render,
    screen,
    within,
} from '@testing-library/react';

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

        const dialog = screen.getByRole('dialog');

        fireEvent.click(
            within(dialog).getByRole('button', { name: 'Excluir' })
        );

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
});
