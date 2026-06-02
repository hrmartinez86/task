const User = require('./User');
const Board = require('./Board');
const BoardMember = require('./BoardMember');
const List = require('./List');
const Card = require('./Card');
const Attachment = require('./Attachment');
const PasswordReset = require('./PasswordReset');

User.belongsToMany(Board, { through: BoardMember, as: 'boards', foreignKey: 'userId' });
Board.belongsToMany(User, { through: BoardMember, as: 'members', foreignKey: 'boardId' });

Board.hasMany(List, { as: 'lists', foreignKey: 'boardId' });
List.belongsTo(Board, { as: 'board', foreignKey: 'boardId' });

List.hasMany(Card, { as: 'cards', foreignKey: 'listId' });
Card.belongsTo(List, { as: 'list', foreignKey: 'listId' });

User.hasMany(Card, { as: 'assignedCards', foreignKey: 'assigneeId' });
Card.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });

Card.hasMany(Attachment, { as: 'attachments', foreignKey: 'cardId', onDelete: 'CASCADE' });
Attachment.belongsTo(Card, { as: 'card', foreignKey: 'cardId' });

User.hasMany(PasswordReset, { as: 'passwordResets', foreignKey: 'userId' });
PasswordReset.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = {
  User,
  Board,
  BoardMember,
  List,
  Card,
  Attachment,
  PasswordReset
};
