import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    createProduct,
    getProductById,
    updateProduct,
} from '../../services/productService';

import type { ProductInput } from '../../types/product';

import './ProductFormPage.css';

interface FormErrors {
    nome?: string;
    categoria?: string;
    preco?: string;
    estoque?: string;
}

const initialForm: ProductInput = {
    nome: '',
    categoria: '',
    preco: 0,
    estoque: 0,
    ativo: true,
};

export const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    const [form, setForm] = useState<ProductInput>(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (!id) {
            return;
        }

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError('');

                const product = await getProductById(Number(id));

                setForm({
                    nome: product.nome,
                    categoria: product.categoria,
                    preco: product.preco,
                    estoque: product.estoque,
                    ativo: product.ativo,
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Não foi possível carregar o produto.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const validate = (): FormErrors => {
        const validationErrors: FormErrors = {};

        if (!form.nome.trim()) {
            validationErrors.nome = 'O nome é obrigatório.';
        } else if (form.nome.trim().length < 3) {
            validationErrors.nome =
                'O nome deve ter pelo menos 3 caracteres.';
        }

        if (!form.categoria.trim()) {
            validationErrors.categoria =
                'A categoria é obrigatória.';
        }

        if (form.preco <= 0) {
            validationErrors.preco =
                'O preço deve ser maior que zero.';
        }

        if (form.estoque < 0) {
            validationErrors.estoque =
                'O estoque não pode ser negativo.';
        }

        return validationErrors;
    };

    const handleChange = (
        field: keyof ProductInput,
        value: string | number | boolean
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));

        setSuccess('');
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const productData: ProductInput = {
                nome: form.nome.trim(),
                categoria: form.categoria.trim(),
                preco: Number(form.preco),
                estoque: Number(form.estoque),
                ativo: form.ativo,
            };

            if (isEditing) {
                await updateProduct(Number(id), productData);
                setSuccess('Produto atualizado com sucesso.');
            } else {
                const createdProduct = await createProduct(productData);

                setSuccess('Produto criado com sucesso.');

                setTimeout(() => {
                    navigate(`/produtos/${createdProduct.id}`);
                }, 800);

                return;
            }

            setTimeout(() => {
                navigate(`/produtos/${id}`);
            }, 800);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Não foi possível salvar o produto.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="product-form-page">
                <div className="product-form-state">
                    <p>Carregando produto...</p>
                </div>
            </main>
        );
    }

    if (error && isEditing && !form.nome) {
        return (
            <main className="product-form-page">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Voltar
                </button>

                <div className="product-form-state product-form-error">
                    <h2>Não foi possível carregar o produto</h2>
                    <p>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="product-form-page">
            <button
                type="button"
                className="back-button"
                onClick={() => navigate(-1)}
            >
                ← Voltar
            </button>

            <header className="product-form-header">
                <div>
                    <span className="product-form-eyebrow">
                        {isEditing ? 'Edição' : 'Cadastro'}
                    </span>

                    <h1>
                        {isEditing
                            ? 'Editar produto'
                            : 'Novo produto'}
                    </h1>

                    <p>
                        {isEditing
                            ? 'Atualize as informações do produto.'
                            : 'Preencha as informações para cadastrar um novo produto.'}
                    </p>
                </div>
            </header>

            <form
                className="product-form"
                onSubmit={handleSubmit}
            >
                <div className="product-form-grid">
                    <div className="form-field form-field-full">
                        <label htmlFor="nome">
                            Nome
                        </label>

                        <input
                            id="nome"
                            type="text"
                            value={form.nome}
                            onChange={(event) =>
                                handleChange(
                                    'nome',
                                    event.target.value
                                )
                            }
                            placeholder="Digite o nome do produto"
                            disabled={saving}
                        />

                        {errors.nome && (
                            <span className="form-error">
                                {errors.nome}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="categoria">
                            Categoria
                        </label>

                        <select
                            id="categoria"
                            value={form.categoria}
                            onChange={(event) =>
                                handleChange(
                                    'categoria',
                                    event.target.value
                                )
                            }
                            disabled={saving}
                        >
                            <option value="">
                                Selecione uma categoria
                            </option>
                            <option value="Perifericos">
                                Periféricos
                            </option>
                            <option value="Monitores">
                                Monitores
                            </option>
                            <option value="Audio">
                                Áudio
                            </option>
                            <option value="Armazenamento">
                                Armazenamento
                            </option>
                            <option value="Componentes">
                                Componentes
                            </option>
                            <option value="Acessorios">
                                Acessórios
                            </option>
                        </select>

                        {errors.categoria && (
                            <span className="form-error">
                                {errors.categoria}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="preco">
                            Preço
                        </label>

                        <input
                            id="preco"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={form.preco}
                            onChange={(event) =>
                                handleChange(
                                    'preco',
                                    Number(event.target.value)
                                )
                            }
                            placeholder="0,00"
                            disabled={saving}
                        />

                        {errors.preco && (
                            <span className="form-error">
                                {errors.preco}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="estoque">
                            Estoque
                        </label>

                        <input
                            id="estoque"
                            type="number"
                            min="0"
                            step="1"
                            value={form.estoque}
                            onChange={(event) =>
                                handleChange(
                                    'estoque',
                                    Number(event.target.value)
                                )
                            }
                            placeholder="0"
                            disabled={saving}
                        />

                        {errors.estoque && (
                            <span className="form-error">
                                {errors.estoque}
                            </span>
                        )}
                    </div>

                    <div className="form-field form-field-full">
                        <label className="form-checkbox">
                            <input
                                type="checkbox"
                                checked={form.ativo}
                                onChange={(event) =>
                                    handleChange(
                                        'ativo',
                                        event.target.checked
                                    )
                                }
                                disabled={saving}
                            />

                            <span>
                                Produto ativo
                            </span>
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="form-feedback form-feedback-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="form-feedback form-feedback-success">
                        {success}
                    </div>
                )}

                <div className="product-form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate("/produtos")}
                        disabled={saving}
                    >
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving}
                    >
                        {saving
                            ? 'Salvando...'
                            : isEditing
                                ? 'Salvar alterações'
                                : 'Cadastrar produto'}
                    </button>
                </div>
            </form>
        </main>
    );
};