const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/profile', protect, deleteProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;