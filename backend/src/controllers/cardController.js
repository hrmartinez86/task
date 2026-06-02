const { Card, List, Attachment, User } = require('../models');
const { sanitizeRichText } = require('../utils/sanitize');
const { invalidateBoardCache } = require('../services/cacheService');
const { publishBoardEvent } = require('../services/eventService');
const { notifyTaskAssigned } = require('../services/notificationService');

async function createCard(req, res, next) {
  try {
    const listId = Number(req.params.listId);
    const { title, description, priority, dueDate, assigneeId } = req.body;

    const list = await List.findByPk(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    const position = await Card.count({ where: { listId } });

    const card = await Card.create({
      listId,
      title,
      description: sanitizeRichText(description),
      priority: priority || 'medium',
      dueDate: dueDate || null,
      assigneeId: assigneeId || null,
      position
    });

    if (card.assigneeId) {
      await notifyTaskAssigned(card);
    }

    await invalidateBoardCache(list.boardId);
    await publishBoardEvent(list.boardId, 'card.created', { card });

    return res.status(201).json(card);
  } catch (error) {
    return next(error);
  }
}

async function updateCard(req, res, next) {
  try {
    const cardId = Number(req.params.cardId);
    const { title, description, priority, dueDate, assigneeId } = req.body;

    const card = await Card.findByPk(cardId, {
      include: [{ model: List, as: 'list' }]
    });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const wasAssignee = card.assigneeId;

    if (title !== undefined) card.title = title;
    if (description !== undefined) card.description = sanitizeRichText(description);
    if (priority !== undefined) card.priority = priority;
    if (dueDate !== undefined) card.dueDate = dueDate || null;
    if (assigneeId !== undefined) card.assigneeId = assigneeId || null;

    await card.save();

    if (card.assigneeId && card.assigneeId !== wasAssignee) {
      await notifyTaskAssigned(card);
    }

    await invalidateBoardCache(card.list.boardId);
    await publishBoardEvent(card.list.boardId, 'card.updated', { card });

    return res.json(card);
  } catch (error) {
    return next(error);
  }
}

async function moveCard(req, res, next) {
  try {
    const cardId = Number(req.params.cardId);
    const { toListId, toPosition } = req.body;

    const card = await Card.findByPk(cardId, { include: [{ model: List, as: 'list' }] });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const targetList = await List.findByPk(Number(toListId));
    if (!targetList) {
      return res.status(404).json({ message: 'Target list not found' });
    }

    const oldListId = card.listId;
    card.listId = Number(toListId);
    card.position = Number(toPosition || 0);
    await card.save();

    const oldListCards = await Card.findAll({ where: { listId: oldListId }, order: [['position', 'ASC']] });
    for (let i = 0; i < oldListCards.length; i += 1) {
      oldListCards[i].position = i;
      await oldListCards[i].save();
    }

    const targetCards = await Card.findAll({ where: { listId: targetList.id }, order: [['position', 'ASC']] });
    for (let i = 0; i < targetCards.length; i += 1) {
      targetCards[i].position = i;
      await targetCards[i].save();
    }

    await invalidateBoardCache(targetList.boardId);
    await publishBoardEvent(targetList.boardId, 'card.moved', {
      cardId: card.id,
      fromListId: oldListId,
      toListId: targetList.id,
      toPosition: card.position
    });

    return res.json({ message: 'Card moved', card });
  } catch (error) {
    return next(error);
  }
}

async function uploadAttachments(req, res, next) {
  try {
    const cardId = Number(req.params.cardId);
    const card = await Card.findByPk(cardId, { include: [{ model: List, as: 'list' }] });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const existingCount = await Attachment.count({ where: { cardId } });
    const incoming = req.files || [];

    if (existingCount + incoming.length > 5) {
      return res.status(400).json({ message: 'Maximum 5 images per card' });
    }

    const rows = incoming.map((file) => ({
      cardId,
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size
    }));

    const attachments = await Attachment.bulkCreate(rows);

    await invalidateBoardCache(card.list.boardId);
    await publishBoardEvent(card.list.boardId, 'card.attachments.updated', {
      cardId,
      attachments
    });

    return res.status(201).json(attachments);
  } catch (error) {
    return next(error);
  }
}

async function listUsers(req, res, next) {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'phone'] });
    return res.json(users);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createCard,
  updateCard,
  moveCard,
  uploadAttachments,
  listUsers
};
