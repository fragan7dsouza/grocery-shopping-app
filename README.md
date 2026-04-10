# Online Grocery Shopping Web Application

Full-stack grocery shopping platform where customers can browse products, add items to cart, place orders, and track order history. Administrators can manage products and process customer orders.

## Tech Stack

- Frontend: React + Vite + React Router + Axios
- Backend: Node.js + Express
- Database: MongoDB (Atlas or local) + Mongoose
- Auth: JWT + bcrypt

## Implemented Features

### Customer

- Register and login
- Browse product catalog
- Add/remove cart items and update quantity
- Place orders
- View personal order history and order details

### Admin

- Role-based protected admin dashboard
- Create, update, delete products
- View all customer orders
- Update order status (pending/confirmed/shipped/delivered/cancelled)
- Transaction summary cards (order count, pending count, revenue)

### Security and Access Control

- JWT authentication middleware
- Customer/admin role checks on protected routes
- Frontend route guards for role-based pages

## Repository Structure

```text
grocery-shopping-app/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   │   └── seedData.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
├── .env
└── README.md
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB Atlas connection string (recommended) or local MongoDB

## Environment Configuration (Single Root .env)

Create/update one file at project root named `.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority
NODE_ENV=development
JWT_SECRET=<your-long-random-secret>
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api
```

Notes:

- Do not commit real credentials.
- `frontend/vite.config.js` is already configured to read env from project root.
- `backend/server.js` is already configured to read env from project root.

## Install and Run

Open two terminals from project root.

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Backend health check: `http://localhost:5000/api/health`

## Seed Demo Data (Optional but Recommended)

To populate demo users/products/orders:

```bash
cd backend
npm run seed
```

Demo credentials created by seed:

- Admin: `admin@grocery.com` / `admin123`
- Customer: `customer@grocery.com` / `customer123`

## Main API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Products

- `GET /api/products` (public)
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Orders

- `POST /api/orders` (customer)
- `GET /api/orders/my` (customer)
- `GET /api/orders` (admin)
- `PUT /api/orders/:id` (admin)

## Handoff Checklist

- Clone repo
- Add root `.env` with valid values
- Run backend and frontend
- (Optional) run seed
- Login as admin and customer to verify flows

## Troubleshooting

- If products do not load:
	- Ensure backend is running on port 5000
	- Verify `VITE_API_BASE_URL` and `FRONTEND_URL` in root `.env`
- If MongoDB auth fails:
	- Check Atlas username/password and network access rules
	- Ensure URI is in `MONGODB_URI` exactly
- If admin page not visible:
	- Login using admin account; page is role-protected

## License

MIT
