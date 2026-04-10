import { useState } from 'react';
import PageCard from '../components/PageCard';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';
import { FALLBACK_PRODUCT_IMAGE, formatINR } from '../utils/formatters';

function CartPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePlaceOrder = async () => {
    if (!token) {
      setErrorMessage('Please login as a customer to place an order.');
      setFeedbackMessage('');
      return;
    }

    if (items.length === 0) {
      return;
    }

    setIsPlacingOrder(true);
    setFeedbackMessage('');
    setErrorMessage('');

    try {
      const payloadItems = items.map((item) => ({
        productId: item._id,
        quantity: item.quantity
      }));

      await placeOrder(payloadItems, token);
      clearCart();
      setFeedbackMessage('Order placed successfully.');
      navigate('/orders');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Failed to place order. Please try again.'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <PageCard
      title="Cart"
      description="Your selected items will appear here before checkout."
    >
      {feedbackMessage ? <p className="state-text">{feedbackMessage}</p> : null}
      {errorMessage ? <p className="state-text error">{errorMessage}</p> : null}

      {items.length === 0 ? (
        <p className="state-text">Your cart is empty.</p>
      ) : (
        <div className="cart-list">
          {items.map((item) => (
            <article key={item._id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                }}
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{formatINR(item.price)}</p>
              </div>

              <div className="cart-controls">
                <input
                  className="qty-input"
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item._id, Number(event.target.value))
                  }
                />
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => removeItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="cart-total">
        <span>Total</span>
        <strong>{formatINR(totalPrice)}</strong>
      </div>

      <div className="cart-actions">
        <button
          className="btn"
          type="button"
          disabled={items.length === 0 || isPlacingOrder}
          onClick={handlePlaceOrder}
        >
          {isPlacingOrder ? 'Placing order...' : 'Place order'}
        </button>
      </div>
    </PageCard>
  );
}

export default CartPage;
