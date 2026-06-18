const express = require('express');
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/booking.controller');
const { authenticate, adminOnly } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticate, getAllBookings);                         // admin: all | customer: own
router.get('/:id', authenticate, getBookingById);
router.post('/', authenticate, createBooking);                        // any logged-in user
router.patch('/:id/status', authenticate, adminOnly, updateBookingStatus);
router.delete('/:id', authenticate, adminOnly, deleteBooking);

module.exports = router;
