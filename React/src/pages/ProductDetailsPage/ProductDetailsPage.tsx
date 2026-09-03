import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { getProductById } from '../../services/productService';

import type { Product } from '../../types/product';

import "./ProductDetailsPage.css"

export const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) {
                setError('Produto não encontrado.');
                setLoading(false);
                return;
            }

            try {
                const productId = Number(id);

                if (Number.isNaN(productId)) {
                    throw new Error('Produto não encontrado.');
                }

                const response = await getProductById(productId);

                setProduct(response);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('Não foi possível carregar o produto.');
                }
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    if (loading) {
        return (
            <main className="products-page">
                <div className="products-state">
                    <span className="loading-spinner" />
                    <p>Carregando produto...</p>
                </div>
            </main>
        );
    }

    if (error || !product) {
        return (
            <main className="products-page">
                <div className="products-state products-state-error">
                    <span className="details-error-icon">!</span>

                    <strong>Não foi possível carregar o produto</strong>

                    <p>
                        {error || 'Produto não encontrado.'}
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => navigate(-1)}
                    >
                        Voltar para produtos
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="products-page">
            <div className="product-details-page">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate(-1)}
                >
                    ← Voltar para produtos
                </button>

                <header className="product-details-hero">
                    <div>
                        <span className="products-eyebrow">
                            DETALHES DO PRODUTO
                        </span>

                        <h1>{product.nome}</h1>

                        <p>
                            Confira as informações e a disponibilidade
                            deste produto.
                        </p>
                    </div>

                    <div className="product-details-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(`/produtos/${product.id}/editar`)
                            }
                        >
                            Editar
                        </button>

                        <button
                            type="button"
                            className="delete-button"
                        >
                            Excluir
                        </button>
                    </div>
                </header>

                <section className="product-details-main">
                    <div className="product-details-card product-details-highlight">
                        <div className="product-details-card-header">
                            <div>
                                <span className="product-details-label">
                                    Produto
                                </span>

                                <h2>{product.nome}</h2>
                            </div>

                            <span
                                className={`product-status ${product.ativo
                                    ? 'active'
                                    : 'inactive'
                                    }`}
                            >
                                {product.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>

                        <div className="product-details-price-section">
                            <span className="product-details-label">
                                Preço
                            </span>

                            <strong className="product-details-price">
                                R$ {product.preco
                                    .toFixed(2)
                                    .replace('.', ',')}
                            </strong>
                        </div>
                    </div>

                    <div className="product-details-info-grid">
                        <div className="product-details-card">
                            <span className="product-details-label">
                                Categoria
                            </span>

                            <strong className="product-details-value">
                                {product.categoria}
                            </strong>
                        </div>

                        <div className="product-details-card">
                            <span className="product-details-label">
                                Estoque
                            </span>

                            <strong className="product-details-value">
                                {product.estoque}
                            </strong>

                            <span className="product-details-helper">
                                {product.estoque === 0
                                    ? 'Produto sem estoque'
                                    : product.estoque === 1
                                        ? '1 unidade disponível'
                                        : `${product.estoque} unidades disponíveis`}
                            </span>
                        </div>

                        <div className="product-details-card">
                            <span className="product-details-label">
                                Status
                            </span>

                            <strong className="product-details-value">
                                {product.ativo
                                    ? 'Disponível'
                                    : 'Indisponível'}
                            </strong>

                            <span className="product-details-helper">
                                {product.ativo
                                    ? 'Produto disponível para venda'
                                    : 'Produto não disponível para venda'}
                            </span>
                        </div>

                        <div className="product-details-card">
                            <span className="product-details-label">
                                Identificador
                            </span>

                            <strong className="product-details-value">
                                #{product.id}
                            </strong>

                            <span className="product-details-helper">
                                Código interno do produto
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

