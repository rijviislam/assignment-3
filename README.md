# 🚗 Vehicle Rental System API

A RESTful API built with **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## Tech Stack

| Layer       | Technology              |
|-------------|-------------------------|
| Runtime     | Node.js                 |
| Framework   | Express.js              |
| ORM         | Prisma                  |
| Database    | PostgreSQL               |
| Auth        | JWT + bcryptjs          |

---

## Project Structure

```
vehicle-rental/
├── prisma/
│   ├── schema.prisma       # Database schema & models
│   └── seed.js             # Sample data seeder
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── vehicle.controller.js
│   │   └── booking.controller.js
│   ├── middlewares/
│   │   └── auth.middleware.js  # JWT auth + role guard
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── vehicle.routes.js
│   │   └── booking.routes.js
│   └── utils/
│       └── prisma.js           # Prisma client singleton
├── index.js                # App entry point
├── .env.example            # Environment variables template
└── package.json
```

---

## Setup & Installation

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd vehicle-rental
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/vehicle_rental"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

### 3. Push schema to database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Create tables in PostgreSQL
```

### 4. Seed sample data

```bash
npm run db:seed
```

This creates:
- **Admin:** `admin@rental.com` / `password123`
- **Customers:** `alice@example.com`, `bob@example.com`, etc. / `password123`
- 7 vehicles + 7 bookings

### 5. Start the server

```bash
npm run dev     # Development (nodemon, auto-restart)
npm start       # Production
```

Server runs at `http://localhost:5000`

---

## API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint           | Access  | Description        |
|--------|--------------------|---------|--------------------|
| POST   | `/api/auth/register` | Public | Register a new user |
| POST   | `/api/auth/login`    | Public | Login & get JWT    |
| GET    | `/api/auth/me`       | Auth   | Get current user   |

**Register body:**
```json
{
  "name": "Alice Rahman",
  "email": "alice@example.com",
  "password": "password123",
  "phone": "01711000001",
  "role": "customer"
}
```

**Login body:**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response includes a JWT token** — use it in the `Authorization` header:
```
Authorization: Bearer <token>
```

---

### Users — `/api/users`

| Method | Endpoint         | Access         | Description       |
|--------|------------------|----------------|-------------------|
| GET    | `/api/users`     | Admin only     | Get all users     |
| GET    | `/api/users/:id` | Auth (own/admin) | Get user by ID   |
| PATCH  | `/api/users/:id` | Auth (own/admin) | Update name/phone |
| DELETE | `/api/users/:id` | Admin only     | Delete user       |

---

### Vehicles — `/api/vehicles`

| Method | Endpoint                       | Access     | Description                         |
|--------|--------------------------------|------------|-------------------------------------|
| GET    | `/api/vehicles`                | Public     | Get all vehicles (filterable)       |
| GET    | `/api/vehicles?type=car`       | Public     | Filter by type (Query 3: WHERE)     |
| GET    | `/api/vehicles?availability=available` | Public | Filter by availability        |
| GET    | `/api/vehicles/never-booked`   | Public     | Vehicles never booked (Query 2: NOT EXISTS) |
| GET    | `/api/vehicles/most-booked`    | Public     | Vehicles with >2 bookings (Query 4: GROUP BY HAVING) |
| GET    | `/api/vehicles/:id`            | Public     | Get vehicle by ID                   |
| POST   | `/api/vehicles`                | Admin only | Create vehicle                      |
| PATCH  | `/api/vehicles/:id`            | Admin only | Update vehicle                      |
| DELETE | `/api/vehicles/:id`            | Admin only | Delete vehicle                      |

**Create vehicle body:**
```json
{
  "name": "Toyota Corolla",
  "type": "car",
  "model": "2022",
  "registrationNumber": "DHK-CA-1001",
  "pricePerDay": 2500,
  "availability": "available"
}
```

---

### Bookings — `/api/bookings`

| Method | Endpoint                      | Access       | Description                        |
|--------|-------------------------------|--------------|------------------------------------|
| GET    | `/api/bookings`               | Auth         | Admin: all bookings / Customer: own (Query 1: JOIN) |
| GET    | `/api/bookings/:id`           | Auth         | Get booking by ID                  |
| POST   | `/api/bookings`               | Auth         | Create booking (auto cost calc)    |
| PATCH  | `/api/bookings/:id/status`    | Admin only   | Update booking status              |
| DELETE | `/api/bookings/:id`           | Admin only   | Delete booking                     |

**Create booking body:**
```json
{
  "vehicleId": 1,
  "startDate": "2025-08-01",
  "endDate": "2025-08-05"
}
```

> Total cost is **auto-calculated**: `pricePerDay × number of days`

**Update status body:**
```json
{
  "status": "confirmed"
}
```

Status values: `pending` → `confirmed` → `completed` | `cancelled`

---

## Business Logic

- ✅ Vehicle auto-marked as `rented` on booking creation
- ✅ Vehicle auto-marked as `available` on booking `cancelled` or `completed`
- ✅ Date conflict check prevents double-booking same vehicle
- ✅ Customers can only view/manage their own bookings
- ✅ Total cost calculated automatically from vehicle price × days
- ✅ All DB operations that touch multiple tables use **Prisma transactions**

---

## Assignment SQL Queries Mapping

| Assignment Query | API Endpoint                    | Concept Used     |
|------------------|---------------------------------|------------------|
| Query 1 (JOIN)   | `GET /api/bookings`             | INNER JOIN users + vehicles |
| Query 2 (EXISTS) | `GET /api/vehicles/never-booked`| NOT EXISTS       |
| Query 3 (WHERE)  | `GET /api/vehicles?type=car&availability=available` | WHERE |
| Query 4 (GROUP BY HAVING) | `GET /api/vehicles/most-booked` | GROUP BY + HAVING COUNT > 2 |

---

## Useful Commands

```bash
npm run dev           # Start dev server
npm run db:push       # Sync schema to DB
npm run db:seed       # Seed sample data
npm run db:studio     # Open Prisma Studio (visual DB browser)
npm run db:generate   # Regenerate Prisma client after schema change
```
