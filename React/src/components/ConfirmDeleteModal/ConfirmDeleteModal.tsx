import type { ConfirmDeleteModalProps } from '../../types/components/confirmDeleteModal';
import './ConfirmDeleteModal.css';

export const ConfirmDeleteModal = ({
    productName,
    onCancel,
    onConfirm,
}: ConfirmDeleteModalProps) => {
    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <div className="delete-modal-icon">
                    !
                </div>

                <h2>Excluir produto?</h2>

                <p>
                    Tem certeza que deseja excluir o produto
                    <strong> {productName}</strong>?
                    Esta ação não pode ser desfeita.
                </p>

                <div className="delete-modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="delete-button"
                        onClick={onConfirm}
                    >
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
};

