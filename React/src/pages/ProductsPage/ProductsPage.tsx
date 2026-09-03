import { useNavigate } from 'react-router-dom';

import { useProducts } from '../../hooks/useProducts';

import './ProductsPage.css';

export const ProductsPage = () => {
    const navigate = useNavigate();

    const {
        products,
        total,
        initialLoading,
        loading,
        loadingMore,
        error,
        searchInput,
        categoria,
        loadMoreRef,
        setSearchInput,
        setCategoria,
    } = useProducts();

    if (initialLoading) {
        return (
            <main className="products-page">
                <div className="products-state">
                    <span className="loading-spinner" />
                    <p>
                        Carregando a página, aguarde...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="products-page">
            <header className="products-header">
                <div>
                    <span className="products-eyebrow">
                        GERENCIAMENTO
                    </span>

                    <h1>Produtos</h1>

                    <p>
                        Gerencie os produtos disponíveis no
                        seu catálogo.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        navigate('/produtos/novo');
                    }}
                >
                    + Novo produto
                </button>
            </header>

            <section className="products-toolbar">
                <div className="search-wrapper">
                    <span className="search-icon">⌕</span>

                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        aria-label="Buscar produto"
                        value={searchInput}
                        onChange={(event) => {
                            setSearchInput(
                                event.target.value
                            );
                        }}
                    />
                </div>

                <select
                    aria-label="Filtrar por categoria"
                    value={categoria}
                    onChange={(event) => {
                        setCategoria(event.target.value);
                    }}
                >
                    <option value="">
                        Todas as categorias
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
            </section>

            <div className="products-summary">
                <span>
                    <strong>{total}</strong>{' '}
                    {total === 1
                        ? 'produto encontrado'
                        : 'produtos encontrados'}
                </span>
            </div>

            {loading ? (
                <div className="products-state">
                    <span className="loading-spinner" />
                    <p>
                        Carregando produtos...
                    </p>
                </div>
            ) : error && products.length === 0 ? (
                <div className="products-state products-state-error">
                    <strong>
                        Ops! Algo deu errado.
                    </strong>
                    <p>{error}</p>
                </div>
            ) : products.length === 0 ? (
                <div className="products-state products-state-empty">
                    <span className="empty-icon">⌕</span>
                    <strong>
                        Nenhum produto encontrado
                    </strong>
                    <p>
                        Tente alterar os filtros ou o
                        termo da busca.
                    </p>
                </div>
            ) : (
                <section className="products-grid">
                    {products.map((product) => (
                        <article
                            className="product-card"
                            key={product.id}
                            onClick={() => {
                                navigate(
                                    `/produtos/${product.id}`
                                );
                            }}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    navigate(
                                        `/produtos/${product.id}`
                                    );
                                }
                            }}
                            role="button"
                            tabIndex={0}
                        >
                            <div className="product-card-header">
                                <span className="product-category">
                                    {product.categoria}
                                </span>

                                <span
                                    className={`product-status ${product.ativo
                                            ? 'active'
                                            : 'inactive'
                                        }`}
                                >
                                    {product.ativo
                                        ? 'Ativo'
                                        : 'Inativo'}
                                </span>
                            </div>

                            <div className="product-card-content">
                                <h2>{product.nome}</h2>

                                <strong className="product-price">
                                    R${' '}
                                    {product.preco
                                        .toFixed(2)
                                        .replace('.', ',')}
                                </strong>
                            </div>

                            <div className="product-card-footer">
                                <span className="product-details-link">
                                    Ver detalhes →
                                </span>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            {products.length > 0 &&
                products.length < total && (
                    <div
                        ref={loadMoreRef}
                        className="load-more"
                    >
                        {loadingMore && (
                            <>
                                <span className="loading-spinner" />
                                <span>
                                    Carregando mais produtos...
                                </span>
                            </>
                        )}
                    </div>
                )}
        </main>
    );
};