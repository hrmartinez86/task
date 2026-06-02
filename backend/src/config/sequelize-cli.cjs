require('dotenv').config({ path: '../.env.example' });

module.exports = {
  development: {
    username: process.env.DB_USER || 'trello_user',
    password: process.env.DB_PASSWORD || 'trello_pass',
    database: process.env.DB_NAME || 'trello_clone',
    host: process.env.DB_HOST || 'mysql',
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false
  }
};
