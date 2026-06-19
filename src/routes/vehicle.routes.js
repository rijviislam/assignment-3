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
router.get('/', getAllVehicles);                         
router.get('/never-booked', getNeverBookedVehicles);    
router.get('/most-booked', getMostBookedVehicles);       
router.get('/:id', getVehicleById);

// Admin only
router.post('/', authenticate, adminOnly, createVehicle);
router.patch('/:id', authenticate, adminOnly, updateVehicle);
router.delete('/:id', authenticate, adminOnly, deleteVehicle);

module.exports = router;
