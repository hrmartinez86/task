const http = require('http');
const app = require('./app');
const env = require('./config/env');
const sequelize = require('./config/database');
const { Server } = require('socket.io');
const { connectRedis, redisSubscriber } = require('./config/redis');
const { registerSocketHandlers } = require('./sockets');
const { startDueReminderJob } = require('./jobs/dueReminderJob');

async function start() {
  await sequelize.authenticate();
  await connectRedis();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: env.corsOrigins,
      credentials: true
    }
  });

  registerSocketHandlers(io);

  await redisSubscriber.subscribe(env.redisChannel, (message) => {
    const event = JSON.parse(message);
    io.to(`board:${event.boardId}`).emit('board:event', event);
  });

  startDueReminderJob();

  server.listen(env.port, () => {
    console.log(`Backend running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error('Server start error:', error);
  process.exit(1);
});
