# Vehicle Rental System — SQL Queries with Solutions

This document contains SQL queries along with explanations and expected outputs for the Vehicle Rental System database.

---

# Sample Data

## Users

```sql
INSERT INTO users (id, name, email, phone, role)
VALUES
(1, 'Alice', 'alice@example.com', '1234567890', 'customer'),
(2, 'Bob', 'bob@example.com', '0987654321', 'admin'),
(3, 'Charlie', 'charlie@example.com', '1122334455', 'customer');
```

## Vehicles

```sql
INSERT INTO vehicles (
    id,
    name,
    type,
    model,
    registration_number,
    price_per_day,
    availability
)
VALUES
(1, 'Toyota Corolla', 'car', '2022', 'ABC-123', 50, 'available'),
(2, 'Honda Civic', 'car', '2021', 'DEF-456', 60, 'rented'),
(3, 'Yamaha R15', 'bike', '2023', 'GHI-789', 30, 'available'),
(4, 'Ford F-150', 'truck', '2020', 'JKL-012', 100, 'maintenance');
```

## Bookings

```sql
INSERT INTO bookings (
    id,
    user_id,
    vehicle_id,
    start_date,
    end_date,
    status,
    total_cost
)
VALUES
(1, 1, 2, '2023-10-01', '2023-10-05', 'completed', 240),
(2, 1, 2, '2023-11-01', '2023-11-03', 'completed', 120),
(3, 3, 2, '2023-12-01', '2023-12-02', 'confirmed', 60),
(4, 1, 1, '2023-12-10', '2023-12-12', 'pending', 100);
```

---

# Query 1: INNER JOIN

## Objective

Retrieve booking information along with customer name and vehicle name.

## Explanation

The `bookings` table stores only foreign keys (`user_id` and `vehicle_id`).

To display the customer name and vehicle name, we join:

* `bookings` → `users`
* `bookings` → `vehicles`

`INNER JOIN` returns only rows where matching records exist in all tables.

## SQL Query

```sql
SELECT
    b.id AS booking_id,
    u.name AS customer_name,
    v.name AS vehicle_name,
    b.start_date,
    b.end_date,
    b.status
FROM bookings b
INNER JOIN users u
    ON b.user_id = u.id
INNER JOIN vehicles v
    ON b.vehicle_id = v.id
ORDER BY b.id;
```

## Expected Output

| booking_id | customer_name | vehicle_name   | start_date | end_date   | status    |
| ---------- | ------------- | -------------- | ---------- | ---------- | --------- |
| 1          | Alice         | Honda Civic    | 2023-10-01 | 2023-10-05 | completed |
| 2          | Alice         | Honda Civic    | 2023-11-01 | 2023-11-03 | completed |
| 3          | Charlie       | Honda Civic    | 2023-12-01 | 2023-12-02 | confirmed |
| 4          | Alice         | Toyota Corolla | 2023-12-10 | 2023-12-12 | pending   |

---

# Query 2: NOT EXISTS

## Objective

Find all vehicles that have never been booked.

## Explanation

For each vehicle, the subquery checks whether any booking exists.

`NOT EXISTS` returns TRUE only when no matching booking is found.

`SELECT 1` is used because we only need to check existence.

## SQL Query

```sql
SELECT
    v.id AS vehicle_id,
    v.name,
    v.type,
    v.model,
    v.registration_number,
    v.price_per_day AS rental_price,
    v.availability AS status
FROM vehicles v
WHERE NOT EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.vehicle_id = v.id
)
ORDER BY v.id;
```

## Expected Output

| vehicle_id | name       | type  | model | registration_number | rental_price | status      |
| ---------- | ---------- | ----- | ----- | ------------------- | ------------ | ----------- |
| 3          | Yamaha R15 | bike  | 2023  | GHI-789             | 30           | available   |
| 4          | Ford F-150 | truck | 2020  | JKL-012             | 100          | maintenance |

---

# Query 3: WHERE Clause

## Objective

Retrieve all available vehicles of type **car**.

## Explanation

The `WHERE` clause filters rows before they are returned.

Conditions:

1. Vehicle must be available.
2. Vehicle type must be car.

## SQL Query

```sql
SELECT
    v.id AS vehicle_id,
    v.name,
    v.type,
    v.model,
    v.registration_number,
    v.price_per_day AS rental_price,
    v.availability AS status
FROM vehicles v
WHERE v.availability = 'available'
  AND v.type = 'car'
ORDER BY v.price_per_day;
```

## Expected Output

| vehicle_id | name           | type | model | registration_number | rental_price | status    |
| ---------- | -------------- | ---- | ----- | ------------------- | ------------ | --------- |
| 1          | Toyota Corolla | car  | 2022  | ABC-123             | 50           | available |

---

# Query 4: GROUP BY and HAVING

## Objective

Find total bookings per vehicle and show only vehicles with more than 2 bookings.

## Explanation

`GROUP BY` groups bookings by vehicle.

`COUNT()` calculates total bookings for each vehicle.

### Difference Between WHERE and HAVING

* `WHERE` filters rows before grouping.
* `HAVING` filters groups after aggregation.

Since `COUNT()` is an aggregate function, we must use `HAVING`.

### Sample Calculation

| Vehicle        | Total Bookings |
| -------------- | -------------- |
| Toyota Corolla | 1              |
| Honda Civic    | 3              |

Applying:

```sql
HAVING COUNT(b.id) > 2
```

Returns only Honda Civic.

## SQL Query

```sql
SELECT
    v.name AS vehicle_name,
    COUNT(b.id) AS total_bookings
FROM vehicles v
INNER JOIN bookings b
    ON b.vehicle_id = v.id
GROUP BY v.id, v.name
HAVING COUNT(b.id) > 2
ORDER BY total_bookings DESC;
```

## Expected Output

| vehicle_name | total_bookings |
| ------------ | -------------- |
| Honda Civic  | 3              |

---

# Summary

This document demonstrates:

* INNER JOIN
* NOT EXISTS
* WHERE Clause
* GROUP BY
* HAVING Clause

using the Vehicle Rental System database schema and sample data.
