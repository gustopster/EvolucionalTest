import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getProducts } from '../../services/productService';

import type { Product, ProductsPageState } from '../../types/product';

import "./ProductsPage.css"

const ITEMS_PER_PAGE = 10;

const SEARCH_DEBOUNCE_MS = 500;

export const ProductsPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const storageKey = `products-page-${location.key}`;

    const [products, setProducts] = useState<Product[]>([]);

    const [total, setTotal] = useState(0);

    const [page, setPage] = useState(1);

    const [initialLoading, setInitialLoading] = useState(true);

    const [loading, setLoading] = useState(false);

    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState('');

    const [searchInput, setSearchInput] = useState('');

    const [search, setSearch] = useState('');

    const [categoria, setCategoria] = useState('');

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const isFirstLoad = useRef(true);

    const requestIdRef = useRef(0);

    const restoredScrollY = useRef<number | null>(null);

    const loadProducts = async (
        pageToLoad: number,
        isInitialLoad = false
    ) => {
        const requestId = ++requestIdRef.current;

        try {
            if (isInitialLoad) {
                setInitialLoading(true);
            } else if (pageToLoad === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            setError('');

            const response = await getProducts({
                page: pageToLoad,
                limit: ITEMS_PER_PAGE,
                search,
                categoria,
            });

            await new Promise((resolve) =>
                setTimeout(resolve, 1500)
            );

            if (requestId !== requestIdRef.current) {
                return;
            }

            setProducts((currentProducts) => {
                if (pageToLoad === 1) {
                    return response.products;
                }

                return [
                    ...currentProducts,
                    ...response.products,
                ];
            });

            setTotal(response.total);

            setPage(pageToLoad);
        } catch {
            if (requestId !== requestIdRef.current) {
                return;
            }

            setError('Não foi possível carregar os produtos.');
        } finally {
            if (requestId !== requestIdRef.current) {
                return;
            }

            if (isInitialLoad) {
                setInitialLoading(false);
            } else if (pageToLoad === 1) {
                setLoading(false);
            } else {
                setLoadingMore(false);
            }
        }
    };

    useEffect(() => {
        const savedState = sessionStorage.getItem(storageKey);

        if (savedState) {
            try {
                const parsedState: ProductsPageState =
                    JSON.parse(savedState);

                setProducts(parsedState.products);
                setTotal(parsedState.total);
                setPage(parsedState.page);
                setSearchInput(parsedState.searchInput);
                setSearch(parsedState.search);
                setCategoria(parsedState.categoria);

                restoredScrollY.current =
                    parsedState.scrollY;

                setInitialLoading(false);

                return;
            } catch {
                sessionStorage.removeItem(storageKey);
            }
        }

        loadProducts(1, true);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearch(searchInput);
        }, SEARCH_DEBOUNCE_MS);

        return () => {
            clearTimeout(timeout);
        };
    }, [searchInput]);

    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }

        setProducts([]);

        setPage(1);

        loadProducts(1);
    }, [search, categoria]);

    useEffect(() => {
        if (initialLoading) {
            return;
        }

        const state: ProductsPageState = {
            products,
            total,
            page,
            searchInput,
            search,
            categoria,
            scrollY: window.scrollY,
        };

        sessionStorage.setItem(
            storageKey,
            JSON.stringify(state)
        );
    }, [
        products,
        total,
        page,
        searchInput,
        search,
        categoria,
        initialLoading,
        storageKey,
    ]);

    useEffect(() => {
        if (restoredScrollY.current === null) {
            return;
        }

        const scrollY = restoredScrollY.current;

        requestAnimationFrame(() => {
            window.scrollTo({
                top: scrollY,
                behavior: 'auto',
            });

            restoredScrollY.current = null;
        });
    }, [products]);

    useEffect(() => {
        const handleScroll = () => {
            if (initialLoading) {
                return;
            }

            const savedState = sessionStorage.getItem(
                storageKey
            );

            if (!savedState) {
                return;
            }

            try {
                const parsedState: ProductsPageState =
                    JSON.parse(savedState);

                parsedState.scrollY = window.scrollY;

                sessionStorage.setItem(
                    storageKey,
                    JSON.stringify(parsedState)
                );
            } catch {
                return;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener(
                'scroll',
                handleScroll
            );
        };
    }, [initialLoading, storageKey]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (!entry.isIntersecting) {
                    return;
                }

                if (loading || loadingMore) {
                    return;
                }

                if (products.length >= total) {
                    return;
                }

                loadProducts(page + 1);
            },
            {
                threshold: 0.1,
            }
        );

        const element = loadMoreRef.current;

        if (element) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, [
        loading,
        loadingMore,
        products.length,
        total,
        page,
    ]);

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
                                <h2>
                                    {product.nome}
                                </h2>

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

