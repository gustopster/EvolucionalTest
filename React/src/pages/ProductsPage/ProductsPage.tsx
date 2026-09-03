import { useEffect, useState } from 'react';

import { getProducts } from '../../services/productService';

import type { Product } from '../../types/product';

export const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await getProducts({
                    page: 1,
                    limit: 10,
                });

                setProducts(response.products);
            } catch {
                setError('Não foi possível carregar os produtos.');
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) {
        return <p>Carregando produtos...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (products.length === 0) {
        return <p>Nenhum produto encontrado.</p>;
    }

    return (
        <main>
            <h1>Produtos</h1>

            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.nome} - R$ {product.preco.toFixed(2)}
                    </li>
                ))}
            </ul>
        </main>
    );
};