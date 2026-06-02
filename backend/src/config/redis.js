const { createClient } = require('redis');
const env = require('./env');

const redisClient = createClient({ url: env.redisUrl });
const redisPublisher = createClient({ url: env.redisUrl });
const redisSubscriber = createClient({ url: env.redisUrl });

async function connectRedis() {
  const clients = [redisClient, redisPublisher, redisSubscriber];

  await Promise.all(
    clients.map(async (client) => {
      client.on('error', (error) => {
        console.error('Redis error:', error.message);
      });

      if (!client.isOpen) {
        await client.connect();
      }
    })
  );
}

module.exports = {
  redisClient,
  redisPublisher,
  redisSubscriber,
  connectRedis
};
