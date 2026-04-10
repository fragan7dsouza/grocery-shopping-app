import { FALLBACK_PRODUCT_IMAGE, formatINR } from '../utils/formatters';

function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
          }}
        />
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{formatINR(product.price)}</p>
        <button className="btn" type="button" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
