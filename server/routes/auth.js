const express = require('express');
const { register, login, logout, refresh, getMe, updateProfile, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validate');
const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', protect, logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getUsers);

module.exports = router;
