const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const { listLinks, addLink, deleteLink } = require('../controllers/cardLinkController');

const router = express.Router({ mergeParams: true });

router.get('/', listLinks);

router.post(
  '/',
  [
    body('label').isLength({ min: 1, max: 255 }).withMessage('Label is required'),
    body('url').isURL({ require_protocol: true }).withMessage('Valid URL with protocol required')
  ],
  validateRequest,
  addLink
);

router.delete('/:linkId', deleteLink);

module.exports = router;
