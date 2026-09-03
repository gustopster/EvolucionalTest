import { useCallback, useEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { getProducts } from '../services/productService';

import type { Product, ProductsPageState } from '../types/product';

const ITEMS_PER_PAGE = 10;

const SEARCH_DEBOUNCE_MS = 500;

const getSavedState = (storageKey: string): ProductsPageState | null => {
    const savedState = sessionStorage.getItem(storageKey);

    if (!savedState) {
        return null;
    }

    try {
        return JSON.parse(savedState);
    } catch {
        sessionStorage.removeItem(storageKey);
        return null;
    }
};

export const useProducts = () => {
    const location = useLocation();

    const storageKey = `products - page - ${location.key} `;

    const savedState = getSavedState(storageKey);

    const [products, setProducts] = useState<Product[]>(
        savedState?.products ?? []
    );

    const [total, setTotal] = useState(
        savedState?.total ?? 0
    );

    const [page, setPage] = useState(
        savedState?.page ?? 1
    );

    const [initialLoading, setInitialLoading] = useState(
        savedState === null
    );

    const [loading, setLoading] = useState(false);

    const [loadingMore, setLoadingMore] = useState(false);

    const [error, setError] = useState('');

    const [searchInput, setSearchInput] = useState(
        savedState?.searchInput ?? ''
    );

    const [search, setSearch] = useState(
        savedState?.search ?? ''
    );

    const [categoria, setCategoria] = useState(
        savedState?.categoria ?? ''
    );

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const isFirstLoad = useRef(true);

    const requestIdRef = useRef(0);

    const restoredScrollY = useRef<number | null>(
        savedState?.scrollY ?? null
    );

    const loadProducts = useCallback(
        async (
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

                setError(
                    'Não foi possível carregar os produtos.'
                );
            } finally {
                if (requestId === requestIdRef.current) {
                    if (isInitialLoad) {
                        setInitialLoading(false);
                    } else if (pageToLoad === 1) {
                        setLoading(false);
                    } else {
                        setLoadingMore(false);
                    }
                }
            }
        },
        [categoria, search]
    );

    useEffect(() => {
        if (savedState) {
            return;
        }

        const timeout = setTimeout(() => {
            loadProducts(1, true);
        }, 0);

        return () => {
            clearTimeout(timeout);
        };
    }, [loadProducts, savedState]);

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
    }, [search, categoria, loadProducts]);

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
        loadProducts,
    ]);

    return {
        products,
        total,
        page,
        initialLoading,
        loading,
        loadingMore,
        error,
        searchInput,
        categoria,
        loadMoreRef,
        setSearchInput,
        setCategoria,
    };
};
