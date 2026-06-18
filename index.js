require('dotenv').config();
const express = require('express');

const authRoutes    = require('./src/routes/auth.routes');
const userRoutes    = require('./src/routes/user.routes');
const vehicleRoutes = require('./src/routes/vehicle.routes');
const bookingRoutes = require('./src/routes/booking.routes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────
app.use(express.json());

// ── Routes ───────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🚗 Vehicle Rental System API',
    version: '1.0.0',
    endpoints: {
      auth:     '/api/auth',
      users:    '/api/users',
      vehicles: '/api/vehicles',
      bookings: '/api/bookings',
    },
  });
});

app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);

// ── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// ── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start Server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
