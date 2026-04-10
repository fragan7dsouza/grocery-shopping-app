import api from './api';

export async function placeOrder(items, token) {
  const response = await api.post(
    '/orders',
    { items },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}

export async function getMyOrders(token) {
  const response = await api.get('/orders/my', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function getAllOrdersAdmin(token) {
  const response = await api.get('/orders', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
}

export async function updateOrderStatusByAdmin(orderId, status, token) {
  const response = await api.put(
    `/orders/${orderId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return response.data;
}
