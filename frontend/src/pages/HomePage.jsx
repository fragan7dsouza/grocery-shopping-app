import { useEffect, useState } from 'react';
import PageCard from '../components/PageCard';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function HomePage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || 'Unable to fetch products right now.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleAddToCart = (product) => {
    addItem(product);
  };

  return (
    <PageCard
      title="Products"
      description="Fresh groceries available for quick delivery."
    >
      {isLoading ? <p className="state-text">Loading products...</p> : null}
      {!isLoading && errorMessage ? (
        <p className="state-text error">{errorMessage}</p>
      ) : null}
      {!isLoading && !errorMessage ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : null}
    </PageCard>
  );
}

export default HomePage;
