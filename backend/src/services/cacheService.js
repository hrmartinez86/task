const { redisClient } = require('../config/redis');

const TTL_SECONDS = 30;

function boardCacheKey(boardId) {
  return `board:${boardId}`;
}

async function getBoardCache(boardId) {
  const cached = await redisClient.get(boardCacheKey(boardId));
  return cached ? JSON.parse(cached) : null;
}

async function setBoardCache(boardId, boardData) {
  await redisClient.setEx(boardCacheKey(boardId), TTL_SECONDS, JSON.stringify(boardData));
}

async function invalidateBoardCache(boardId) {
  await redisClient.del(boardCacheKey(boardId));
}

module.exports = {
  getBoardCache,
  setBoardCache,
  invalidateBoardCache
};
