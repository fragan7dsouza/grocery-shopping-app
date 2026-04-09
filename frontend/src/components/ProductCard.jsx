function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>

      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${Number(product.price).toFixed(2)}</p>
        <button className="btn" type="button" onClick={() => onAddToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
