const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const upload = require('../middlewares/uploadMiddleware');
const cardController = require('../controllers/cardController');

const router = express.Router();

router.get('/users', cardController.listUsers);

router.post(
  '/lists/:listId/cards',
  [body('title').isLength({ min: 1 }), body('priority').optional().isIn(['low', 'medium', 'high'])],
  validateRequest,
  cardController.createCard
);

router.put(
  '/cards/:cardId',
  [body('priority').optional().isIn(['low', 'medium', 'high'])],
  validateRequest,
  cardController.updateCard
);

router.put('/cards/:cardId/move', cardController.moveCard);
router.post('/cards/:cardId/attachments', upload.array('images', 5), cardController.uploadAttachments);

module.exports = router;
