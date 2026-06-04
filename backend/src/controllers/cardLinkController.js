const { CardLink, Card, List } = require('../models');
const { invalidateBoardCache } = require('../services/cacheService');
const { publishBoardEvent } = require('../services/eventService');

async function listLinks(req, res, next) {
  try {
    const cardId = Number(req.params.cardId);
    const links = await CardLink.findAll({ where: { cardId }, order: [['createdAt', 'ASC']] });
    return res.json(links);
  } catch (error) {
    return next(error);
  }
}

async function addLink(req, res, next) {
  try {
    const cardId = Number(req.params.cardId);
    const { label, url } = req.body;

    const card = await Card.findByPk(cardId, { include: [{ model: List, as: 'list' }] });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const link = await CardLink.create({ cardId, label, url });

    await invalidateBoardCache(card.list.boardId);
    await publishBoardEvent(card.list.boardId, 'card.links.updated', { cardId });

    return res.status(201).json(link);
  } catch (error) {
    return next(error);
  }
}

async function deleteLink(req, res, next) {
  try {
    const linkId = Number(req.params.linkId);

    const link = await CardLink.findByPk(linkId, {
      include: [{ model: Card, as: 'card', include: [{ model: List, as: 'list' }] }]
    });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    const boardId = link.card.list.boardId;
    await link.destroy();

    await invalidateBoardCache(boardId);
    await publishBoardEvent(boardId, 'card.links.updated', { cardId: link.cardId });

    return res.json({ message: 'Link deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = { listLinks, addLink, deleteLink };
