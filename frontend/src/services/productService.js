import api from './api';

export async function getProducts() {
  const response = await api.get('/products');
  return response.data;
}

export async function createProduct(payload, token) {
  const response = await api.post('/products', payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function updateProduct(productId, payload, token) {
  const response = await api.put(`/products/${productId}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function deleteProduct(productId, token) {
  const response = await api.delete(`/products/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}
