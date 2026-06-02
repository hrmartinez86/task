const express = require('express');
const { body } = require('express-validator');
const validateRequest = require('../middlewares/validateRequest');
const boardController = require('../controllers/boardController');
const listController = require('../controllers/listController');

const router = express.Router();

router.get('/', boardController.listBoards);
router.post('/', [body('name').isLength({ min: 3 })], validateRequest, boardController.createBoard);
router.get('/:id', boardController.getBoard);
router.post('/:id/invite', [body('email').isEmail()], validateRequest, boardController.inviteMember);
router.post('/:boardId/lists', [body('title').isLength({ min: 2 })], validateRequest, listController.createList);

module.exports = router;
