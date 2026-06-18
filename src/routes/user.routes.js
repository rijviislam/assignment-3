const express = require('express');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const { authenticate, adminOnly } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', authenticate, adminOnly, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, adminOnly, deleteUser);

module.exports = router;
