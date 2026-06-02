const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
  ],
  validateRequest,
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  validateRequest,
  authController.login
);

router.post('/forgot-password', [body('email').isEmail()], validateRequest, authController.forgotPassword);
router.post(
  '/reset-password',
  [body('token').isLength({ min: 10 }), body('newPassword').isLength({ min: 8 })],
  validateRequest,
  authController.resetPassword
);

module.exports = router;
