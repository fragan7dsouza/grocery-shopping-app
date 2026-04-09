# Backend

Node.js REST API backend for the grocery shopping application.

## Authentication

Implemented with Mongoose, bcryptjs, and JWT.

### User Model

- name
- email
- password (hashed with bcrypt before save)
- role (customer/admin)

### APIs

- POST /api/auth/register
- POST /api/auth/login

`/api/auth/login` returns a JWT token.

### Middleware

- `protect`: verifies a Bearer token and attaches the user to `req.user`
- `adminOnly`: allows only users with role `admin`

Example usage in any route file:

```js
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/profile', protect, (req, res) => {
	res.json(req.user);
});

router.get('/admin/stats', protect, adminOnly, (req, res) => {
	res.json({ message: 'Admin data' });
});
```

## Products

### Product Model

- name
- price
- category
- stock
- image

### APIs

- GET /api/products (public)
- POST /api/products (admin only)
- PUT /api/products/:id (admin only)
- DELETE /api/products/:id (admin only)

All write APIs are protected using `protect` + `adminOnly` middleware.

## Orders

### Order Model

- userId
- items [{ productId, quantity }]
- totalAmount
- status

### APIs

- POST /api/orders (customer)
- GET /api/orders/my (customer)
- GET /api/orders (admin)
- PUT /api/orders/:id (admin updates status)

Relationship handling:

- `userId` references the User model
- `items.productId` references the Product model
- Order creation validates all product IDs and computes `totalAmount` from product price and quantity
- Product stock is reduced when an order is created
