import { useEffect, useMemo, useState } from 'react';
import PageCard from '../components/PageCard';
import { useAuth } from '../context/AuthContext';
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct
} from '../services/productService';
import {
  getAllOrdersAdmin,
  updateOrderStatusByAdmin
} from '../services/orderService';
import { formatINR } from '../utils/formatters';

const ORDER_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

function AdminPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingProductId, setEditingProductId] = useState('');
  const [orderStatusDrafts, setOrderStatusDrafts] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  const transactionSummary = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((order) => order.status === 'pending').length;
    const totalRevenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    return { totalOrders, pendingOrders, totalRevenue };
  }, [orders]);

  const loadAdminData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [productsData, ordersData] = await Promise.all([
        getProducts(),
        getAllOrdersAdmin(token)
      ]);

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
      setOrderStatusDrafts(
        (ordersData.orders || []).reduce((acc, order) => {
          acc[order._id] = order.status;
          return acc;
        }, {})
      );
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to load admin data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      stock: '',
      image: ''
    });
    setEditingProductId('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleEditProduct = (product) => {
    setFormData({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      image: product.image
    });
    setEditingProductId(product._id);
    setMessage('Editing selected product.');
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    setIsSavingProduct(true);
    setMessage('');
    setErrorMessage('');

    try {
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category.trim(),
        stock: Number(formData.stock),
        image: formData.image.trim()
      };

      if (editingProductId) {
        await updateProduct(editingProductId, payload, token);
        setMessage('Product updated successfully.');
      } else {
        await createProduct(payload, token);
        setMessage('Product created successfully.');
      }

      resetForm();
      await loadAdminData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to save product.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setMessage('');
      setErrorMessage('');
      await deleteProduct(productId, token);
      setMessage('Product deleted successfully.');
      await loadAdminData();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to delete product.');
    }
  };

  const handleOrderStatusChange = (orderId, value) => {
    setOrderStatusDrafts((current) => ({
      ...current,
      [orderId]: value
    }));
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      setMessage('');
      setErrorMessage('');
      await updateOrderStatusByAdmin(orderId, orderStatusDrafts[orderId], token);
      setMessage('Order status updated successfully.');
      await loadAdminData();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Unable to update order status.'
      );
    }
  };

  return (
    <PageCard
      title="Admin"
      description="Manage products and monitor all customer orders."
    >
      {message ? <p className="state-text">{message}</p> : null}
      {errorMessage ? <p className="state-text error">{errorMessage}</p> : null}

      <section className="admin-section">
        <h3>Transaction Overview</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <span>Total Orders</span>
            <strong>{transactionSummary.totalOrders}</strong>
          </div>
          <div className="summary-card">
            <span>Pending Orders</span>
            <strong>{transactionSummary.pendingOrders}</strong>
          </div>
          <div className="summary-card">
            <span>Total Revenue</span>
            <strong>{formatINR(transactionSummary.totalRevenue)}</strong>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h3>{editingProductId ? 'Edit Product' : 'Create Product'}</h3>
        <form className="form admin-form" onSubmit={handleProductSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Product name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="Price"
            value={formData.price}
            onChange={handleFormChange}
            required
          />
          <input
            name="category"
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={handleFormChange}
            required
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            value={formData.stock}
            onChange={handleFormChange}
            required
          />
          <input
            name="image"
            type="url"
            placeholder="Image URL"
            value={formData.image}
            onChange={handleFormChange}
            required
          />

          <div className="admin-actions-row">
            <button className="btn" type="submit" disabled={isSavingProduct}>
              {isSavingProduct
                ? 'Saving...'
                : editingProductId
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
            {editingProductId ? (
              <button className="btn btn-secondary" type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="admin-section">
        <h3>Products</h3>
        {isLoading ? <p className="state-text">Loading products...</p> : null}
        {!isLoading ? (
          <div className="admin-list">
            {products.map((product) => (
              <article key={product._id} className="admin-list-item">
                <div>
                  <h4>{product.name}</h4>
                  <p>
                    {product.category} | {formatINR(product.price)} | Stock: {product.stock}
                  </p>
                </div>
                <div className="admin-actions-row">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    type="button"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="admin-section">
        <h3>All Orders</h3>
        {isLoading ? <p className="state-text">Loading orders...</p> : null}
        {!isLoading ? (
          <div className="admin-list">
            {orders.map((order) => (
              <article key={order._id} className="admin-list-item">
                <div>
                  <h4>
                    #{order._id.slice(-6)} | {order.userId?.name || 'Customer'}
                  </h4>
                  <p>
                    {order.userId?.email || 'No email'} | {formatINR(order.totalAmount)}
                  </p>
                </div>

                <div className="admin-actions-row">
                  <select
                    className="admin-select"
                    value={orderStatusDrafts[order._id] || order.status}
                    onChange={(event) =>
                      handleOrderStatusChange(order._id, event.target.value)
                    }
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  <button
                    className="btn"
                    type="button"
                    onClick={() => handleUpdateOrderStatus(order._id)}
                  >
                    Update Status
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </PageCard>
  );
}

export default AdminPage;
