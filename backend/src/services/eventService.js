const env = require('../config/env');
const { redisPublisher } = require('../config/redis');

async function publishBoardEvent(boardId, type, payload) {
  const message = JSON.stringify({ boardId, type, payload, timestamp: Date.now() });
  await redisPublisher.publish(env.redisChannel, message);
}

module.exports = {
  publishBoardEvent
};
