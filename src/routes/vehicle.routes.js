const express = require('express');
const {
  getAllVehicles,
  getNeverBookedVehicles,
  getMostBookedVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicle.controller');
const { authenticate, adminOnly } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/', getAllVehicles);                          // ?type=car&availability=available
router.get('/never-booked', getNeverBookedVehicles);     // Query 2: NOT EXISTS
router.get('/most-booked', getMostBookedVehicles);       // Query 4: GROUP BY HAVING
router.get('/:id', getVehicleById);

// Admin only
router.post('/', authenticate, adminOnly, createVehicle);
router.patch('/:id', authenticate, adminOnly, updateVehicle);
router.delete('/:id', authenticate, adminOnly, deleteVehicle);

module.exports = router;
