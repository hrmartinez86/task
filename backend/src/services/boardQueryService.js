const { Board, BoardMember, List, Card, Attachment, CardLink, User } = require('../models');
const { getBoardCache, setBoardCache } = require('./cacheService');

async function getBoardForUser(boardId, userId) {
  const cached = await getBoardCache(boardId);

  if (cached) {
    const isMember = cached.members.some((member) => member.id === userId);
    if (!isMember) {
      return null;
    }
    return cached;
  }

  const board = await Board.findByPk(boardId, {
    include: [
      {
        model: User,
        as: 'members',
        attributes: ['id', 'name', 'email', 'phone'],
        through: { attributes: ['role'] }
      },
      {
        model: List,
        as: 'lists',
        include: [
          {
            model: Card,
            as: 'cards',
            include: [
              { model: Attachment, as: 'attachments' },
              { model: CardLink, as: 'links' },
              { model: User, as: 'assignee', attributes: ['id', 'name', 'email', 'phone'] }
            ]
          }
        ]
      }
    ],
    order: [
      [{ model: List, as: 'lists' }, 'position', 'ASC'],
      [{ model: List, as: 'lists' }, { model: Card, as: 'cards' }, 'position', 'ASC']
    ]
  });

  if (!board) {
    return null;
  }

  const boardJson = board.toJSON();
  const isMember = boardJson.members.some((member) => member.id === userId);

  if (!isMember) {
    return null;
  }

  await setBoardCache(boardId, boardJson);
  return boardJson;
}

async function ensureBoardMember(boardId, userId) {
  const membership = await BoardMember.findOne({ where: { boardId, userId } });
  return Boolean(membership);
}

module.exports = {
  getBoardForUser,
  ensureBoardMember
};
