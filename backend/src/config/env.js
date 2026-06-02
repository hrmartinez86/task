const dotenv = require('dotenv');

dotenv.config({ path: process.env.ENV_FILE || '../.env.example' });

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  db: {
    name: process.env.DB_NAME || 'trello_clone',
    user: process.env.DB_USER || 'trello_user',
    password: process.env.DB_PASSWORD || 'trello_pass',
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || 'mysql'
  },
  redisUrl: process.env.REDIS_URL || 'redis://redis:6379',
  redisChannel: process.env.REDIS_CHANNEL || 'board-events',
  corsOrigins,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  whatsappWebhookUrl: process.env.WHATSAPP_WEBHOOK_URL || 'http://whatsapp:4000/webhook/send',
  uploadsDir: process.env.UPLOADS_DIR || 'uploads'
};
