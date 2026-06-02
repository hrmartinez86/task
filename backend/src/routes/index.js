const express = require('express');
const authRoutes = require('./authRoutes');
const boardRoutes = require('./boardRoutes');
const cardRoutes = require('./cardRoutes');
const healthRoutes = require('./healthRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/boards', authMiddleware, boardRoutes);
router.use('/', authMiddleware, cardRoutes);

module.exports = router;
