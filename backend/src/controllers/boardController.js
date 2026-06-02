const { Board, BoardMember, List, User } = require('../models');
const { getBoardForUser } = require('../services/boardQueryService');
const { invalidateBoardCache } = require('../services/cacheService');

async function listBoards(req, res, next) {
  try {
    const userId = req.user.id;

    const boards = await Board.findAll({
      include: [
        {
          model: User,
          as: 'members',
          where: { id: userId },
          through: { attributes: ['role'] }
        }
      ]
    });

    return res.json(boards);
  } catch (error) {
    return next(error);
  }
}

async function createBoard(req, res, next) {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    const board = await Board.create({ name, ownerId: userId });
    await BoardMember.create({ boardId: board.id, userId, role: 'owner' });

    await List.bulkCreate([
      { boardId: board.id, title: 'Por hacer', position: 0 },
      { boardId: board.id, title: 'En progreso', position: 1 },
      { boardId: board.id, title: 'Hecho', position: 2 }
    ]);

    return res.status(201).json(board);
  } catch (error) {
    return next(error);
  }
}

async function getBoard(req, res, next) {
  try {
    const boardId = Number(req.params.id);
    const userId = req.user.id;

    const board = await getBoardForUser(boardId, userId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found or access denied' });
    }

    return res.json(board);
  } catch (error) {
    return next(error);
  }
}

async function inviteMember(req, res, next) {
  try {
    const boardId = Number(req.params.id);
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found with that email' });
    }

    const existing = await BoardMember.findOne({ where: { boardId, userId: user.id } });
    if (existing) {
      return res.status(409).json({ message: 'User is already a member of this board' });
    }

    await BoardMember.create({ boardId, userId: user.id, role: 'member' });
    await invalidateBoardCache(boardId);

    return res.json({ message: 'Member invited successfully' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBoards,
  createBoard,
  getBoard,
  inviteMember
};
