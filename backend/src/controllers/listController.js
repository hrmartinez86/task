const { List, BoardMember } = require('../models');
const { invalidateBoardCache } = require('../services/cacheService');

async function createList(req, res, next) {
  try {
    const userId = req.user.id;
    const boardId = Number(req.params.boardId);
    const { title } = req.body;

    const member = await BoardMember.findOne({ where: { boardId, userId } });
    if (!member) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const count = await List.count({ where: { boardId } });
    const list = await List.create({ boardId, title, position: count });

    await invalidateBoardCache(boardId);
    return res.status(201).json(list);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createList
};
