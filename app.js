const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

require('dotenv').config();

console.log('Окружение:', process.env.NODE_ENV); // проверка взаимодействия с .env файлом на проде

const usersRoutes = require('./routes/users');
const moviesRoutes = require('./routes/movies');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
// const cors = require('./middlewares/cors');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use('/', auth, usersRoutes);
app.use('/', auth, moviesRoutes);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
