const users = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

users.get('/users/me', getUser);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateUser);

module.exports = users;
