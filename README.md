# Vehicle Rental System Database Assignment

## Project Overview

The Vehicle Rental System is a relational database project designed to manage vehicle rentals efficiently. The database stores information about users, vehicles, and bookings while maintaining relationships between tables through primary and foreign keys.

This assignment demonstrates the use of:

* Primary Keys
* Foreign Keys
* INNER JOIN
* LEFT JOIN
* WHERE Clause
* GROUP BY
* HAVING Clause
* NOT EXISTS
* Relational Database Concepts

---

# Database Tables

## Users

Stores customer and admin information.

| Column | Description            |
| ------ | ---------------------- |
| id     | Unique user identifier |
| name   | User name              |
| email  | User email             |
| phone  | User phone number      |
| role   | Customer or Admin      |

---

## Vehicles

Stores vehicle information.

| Column              | Description               |
| ------------------- | ------------------------- |
| id                  | Unique vehicle identifier |
| name                | Vehicle name              |
| type                | Vehicle type              |
| model               | Vehicle model             |
| registration_number | Registration number       |
| price_per_day       | Daily rental price        |
| availability        | Vehicle status            |

---

## Bookings

Stores rental booking information.

| Column     | Description                 |
| ---------- | --------------------------- |
| id         | Booking ID                  |
| user_id    | Reference to Users table    |
| vehicle_id | Reference to Vehicles table |
| start_date | Rental start date           |
| end_date   | Rental end date             |
| status     | Booking status              |
| total_cost | Total rental cost           |

---

# SQL Queries and Solutions

## Query 1: INNER JOIN

### Objective

Retrieve booking information together with customer names and vehicle names.

### SQL

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

### Explanation

The bookings table contains only foreign key references (`user_id` and `vehicle_id`).

Using INNER JOIN allows us to retrieve the actual customer and vehicle information from the related tables.

---

## Query 2: NOT EXISTS

### Objective

Find vehicles that have never been booked.

### SQL

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

### Explanation

The subquery checks whether a booking exists for a vehicle.

If no booking exists, NOT EXISTS returns TRUE and the vehicle is included in the result.

---

## Query 3: WHERE Clause

### Objective

Retrieve all available cars.

### SQL

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

### Explanation

The WHERE clause filters rows before returning results.

Only vehicles that are:

* Available
* Type = Car

are returned.

---

## Query 4: GROUP BY and HAVING

### Objective

Find vehicles with more than two bookings.

### SQL

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

### Explanation

GROUP BY groups bookings by vehicle.

COUNT() calculates the number of bookings for each vehicle.

HAVING filters grouped results and returns only vehicles with more than two bookings.

---

# Theory Questions and Answers

## Question 1

### What is a foreign key and why is it important in relational databases?

A foreign key is a column that references the primary key of another table. It creates a relationship between tables and helps maintain data integrity. Foreign keys prevent invalid references and ensure consistency across related tables.

---

## Question 2

### What is the difference between WHERE and HAVING clauses in SQL?

The WHERE clause filters individual rows before grouping takes place.

The HAVING clause filters grouped results after aggregation functions such as COUNT(), SUM(), or AVG() are applied.

Example:

```sql
WHERE status = 'available'
```

filters rows.

```sql
HAVING COUNT(*) > 2
```

filters groups.

---

## Question 3

### What is a primary key and what are its characteristics?

A primary key is a column (or set of columns) that uniquely identifies each row in a table.

Characteristics:

* Must be unique
* Cannot contain NULL values
* One primary key per table
* Ensures entity integrity
* Used to create relationships with foreign keys

Example:

```sql
id INT PRIMARY KEY
```

---

## Question 4

### What is the difference between INNER JOIN and LEFT JOIN in SQL?

INNER JOIN returns only matching records from both tables.

LEFT JOIN returns all records from the left table and matching records from the right table. If no match exists, NULL values are returned for the right table columns.

Example:

```sql
SELECT *
FROM bookings b
INNER JOIN users u
ON b.user_id = u.id;
```

Returns only matching bookings and users.

```sql
SELECT *
FROM users u
LEFT JOIN bookings b
ON u.id = b.user_id;
```

Returns all users, even if they have no bookings.

---

# How to Run

1. Create the database.
2. Create the required tables.
3. Insert the sample data.
4. Run the queries from the `queries.sql` file.
5. Verify the output against the expected results.

---

# Conclusion

This project demonstrates core relational database concepts including table relationships, data filtering, aggregation, and SQL joins. It provides practical examples of how SQL can be used to manage and analyze data within a Vehicle Rental System.
