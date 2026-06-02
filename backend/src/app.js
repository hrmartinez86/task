const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const isNgrokFree = /^https:\/\/[a-z0-9-]+\.ngrok-free\.dev$/i.test(origin || '');

      if (!origin || env.corsOrigins.includes(origin) || isNgrokFree) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.resolve(env.uploadsDir)));

app.use('/api', routes);

app.use(errorHandler);

module.exports = app;
