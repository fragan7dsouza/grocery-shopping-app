import { useEffect, useState } from 'react';
import PageCard from '../components/PageCard';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../services/orderService';
import { FALLBACK_PRODUCT_IMAGE, formatINR } from '../utils/formatters';

function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        setErrorMessage('Please login as a customer to view your orders.');
        setIsLoading(false);
        return;
      }

      try {
        const data = await getMyOrders(token);
        setOrders(data.orders || []);
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || 'Unable to load order history.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  return (
    <PageCard
      title="My Orders"
      description="Track and review your previous grocery orders."
    >
      {isLoading ? <p className="state-text">Loading orders...</p> : null}
      {!isLoading && errorMessage ? (
        <p className="state-text error">{errorMessage}</p>
      ) : null}

      {!isLoading && !errorMessage && orders.length === 0 ? (
        <p className="state-text">No orders yet. Place one from your cart.</p>
      ) : null}

      {!isLoading && !errorMessage && orders.length > 0 ? (
        <div className="orders-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-meta">
                  <span className="order-status">{order.status}</span>
                  <strong>{formatINR(order.totalAmount)}</strong>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => {
                  const product = item.productId;
                  const price = Number(product?.price || 0);
                  const itemTotal = price * item.quantity;

                  return (
                    <div
                      key={`${order._id}-${product?._id || index}`}
                      className="order-item"
                    >
                      {product?.image ? (
                        <img
                          src={product.image}
                          alt={product.name || 'Product'}
                          className="order-item-image"
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                          }}
                        />
                      ) : null}

                      <div className="order-item-info">
                        <h4>{product?.name || 'Product unavailable'}</h4>
                        <p>
                          Qty: {item.quantity} x {formatINR(price)}
                        </p>
                      </div>

                      <strong>{formatINR(itemTotal)}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </PageCard>
  );
}

export default OrdersPage;
