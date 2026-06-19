-- ============================================================
--  Vehicle Rental System — SQL Queries with Solutions
-- ============================================================


-- ============================================================
--  SAMPLE DATA
-- ============================================================

INSERT INTO users (id, name, email, phone, role) VALUES
  (1, 'Alice',   'alice@example.com',   '1234567890', 'customer'),
  (2, 'Bob',     'bob@example.com',     '0987654321', 'admin'),
  (3, 'Charlie', 'charlie@example.com', '1122334455', 'customer');

INSERT INTO vehicles (id, name, type, model, registration_number, price_per_day, availability) VALUES
  (1, 'Toyota Corolla', 'car',   '2022', 'ABC-123', 50,  'available'),
  (2, 'Honda Civic',    'car',   '2021', 'DEF-456', 60,  'rented'),
  (3, 'Yamaha R15',     'bike',  '2023', 'GHI-789', 30,  'available'),
  (4, 'Ford F-150',     'truck', '2020', 'JKL-012', 100, 'maintenance');

INSERT INTO bookings (id, user_id, vehicle_id, start_date, end_date, status, total_cost) VALUES
  (1, 1, 2, '2023-10-01', '2023-10-05', 'completed', 240),
  (2, 1, 2, '2023-11-01', '2023-11-03', 'completed', 120),
  (3, 3, 2, '2023-12-01', '2023-12-02', 'confirmed', 60),
  (4, 1, 1, '2023-12-10', '2023-12-12', 'pending',   100);


-- ============================================================
--  QUERY 1: INNER JOIN
--  Retrieve booking information along with customer name
--  and vehicle name.
-- ============================================================
--
--  Explanation:
--  The bookings table stores only user_id and vehicle_id
--  (foreign keys). To get the actual customer name and
--  vehicle name, we JOIN the users and vehicles tables.
--
--  INNER JOIN returns only rows where a match exists
--  in ALL joined tables.
--
--  Expected Output:
--  | booking_id | customer_name | vehicle_name   | start_date | end_date   | status    |
--  |------------|---------------|----------------|------------|------------|-----------|
--  | 1          | Alice         | Honda Civic    | 2023-10-01 | 2023-10-05 | completed |
--  | 2          | Alice         | Honda Civic    | 2023-11-01 | 2023-11-03 | completed |
--  | 3          | Charlie       | Honda Civic    | 2023-12-01 | 2023-12-02 | confirmed |
--  | 4          | Alice         | Toyota Corolla | 2023-12-10 | 2023-12-12 | pending   |
-- ============================================================

SELECT
    b.id         AS booking_id,
    u.name       AS customer_name,
    v.name       AS vehicle_name,
    b.start_date,
    b.end_date,
    b.status
FROM bookings b
INNER JOIN users    u ON b.user_id    = u.id
INNER JOIN vehicles v ON b.vehicle_id = v.id
ORDER BY b.id;


-- ============================================================
--  QUERY 2: NOT EXISTS
--  Find all vehicles that have never been booked.
-- ============================================================
--
--  Explanation:
--  For each vehicle, the subquery checks if any booking
--  exists with that vehicle_id.
--  NOT EXISTS = TRUE when NO booking is found → vehicle
--  is included in the result.
--
--  SELECT 1 is used because we only care about existence,
--  not the actual data returned.
--
--  From sample data:
--  → vehicle 1 (Toyota Corolla) → has booking 4    → SKIP
--  → vehicle 2 (Honda Civic)    → has bookings 1,2,3 → SKIP
--  → vehicle 3 (Yamaha R15)     → no bookings      → INCLUDE ✓
--  → vehicle 4 (Ford F-150)     → no bookings      → INCLUDE ✓
--
--  Expected Output:
--  | vehicle_id | name       | type  | model | registration_number | rental_price | status      |
--  |------------|------------|-------|-------|---------------------|--------------|-------------|
--  | 3          | Yamaha R15 | bike  | 2023  | GHI-789             | 30           | available   |
--  | 4          | Ford F-150 | truck | 2020  | JKL-012             | 100          | maintenance |
-- ============================================================

SELECT
    v.id                  AS vehicle_id,
    v.name,
    v.type,
    v.model,
    v.registration_number,
    v.price_per_day       AS rental_price,
    v.availability        AS status
FROM vehicles v
WHERE NOT EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.vehicle_id = v.id
)
ORDER BY v.id;


-- ============================================================
--  QUERY 3: WHERE
--  Retrieve all available vehicles of a specific type
--  (cars in this example).
-- ============================================================
--
--  Explanation:
--  WHERE filters rows before returning results.
--  Two conditions combined with AND:
--    1. availability = 'available' → only rentable vehicles
--    2. type = 'car'               → only cars
--
--  From sample data:
--  → vehicle 1 (Toyota Corolla) → car + available    → INCLUDE ✓
--  → vehicle 2 (Honda Civic)    → car + rented        → SKIP
--  → vehicle 3 (Yamaha R15)     → bike + available    → SKIP (wrong type)
--  → vehicle 4 (Ford F-150)     → truck + maintenance → SKIP
--
--  Expected Output:
--  | vehicle_id | name           | type | model | registration_number | rental_price | status    |
--  |------------|----------------|------|-------|---------------------|--------------|-----------|
--  | 1          | Toyota Corolla | car  | 2022  | ABC-123             | 50           | available |
-- ============================================================

SELECT
    v.id                  AS vehicle_id,
    v.name,
    v.type,
    v.model,
    v.registration_number,
    v.price_per_day       AS rental_price,
    v.availability        AS status
FROM vehicles v
WHERE v.availability = 'available'
  AND v.type = 'car'
ORDER BY v.price_per_day;


-- ============================================================
--  QUERY 4: GROUP BY and HAVING
--  Find total bookings per vehicle, show only those
--  with MORE than 2 bookings.
-- ============================================================
--
--  Explanation:
--  GROUP BY groups all booking rows by vehicle.
--  COUNT(b.id) counts total bookings per vehicle.
--
--  KEY DIFFERENCE — WHERE vs HAVING:
--  → WHERE  filters rows BEFORE grouping
--  → HAVING filters groups AFTER grouping
--  We must use HAVING here because COUNT is calculated
--  AFTER the GROUP BY — WHERE cannot filter aggregates.
--
--  Step by step with sample data:
--  Step 1: JOIN vehicles with bookings
--  Step 2: GROUP BY vehicle:
--          Toyota Corolla → 1 booking  (booking 4)
--          Honda Civic    → 3 bookings (bookings 1, 2, 3)
--  Step 3: HAVING COUNT > 2:
--          Toyota Corolla → 1 > 2? NO  → SKIP
--          Honda Civic    → 3 > 2? YES → INCLUDE ✓
--
--  Expected Output:
--  | vehicle_name | total_bookings |
--  |--------------|----------------|
--  | Honda Civic  | 3              |
-- ============================================================

SELECT
    v.name       AS vehicle_name,
    COUNT(b.id)  AS total_bookings
FROM vehicles v
INNER JOIN bookings b ON b.vehicle_id = v.id
GROUP BY v.id, v.name
HAVING COUNT(b.id) > 2
ORDER BY total_bookings DESC;
