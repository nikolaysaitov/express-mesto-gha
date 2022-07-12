// app.js — входной файл

const express = require('express');

const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
// const helmet = require('helmet');
// const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const cors = require('./middlewares/cors');
const NotFoundError = require('./errors/not-found-err_404');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// подключаем мидлвары, роуты и всё остальное...
// app.use(helmet());
app.use(bodyParser.json());
// app.use(cors);
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cookieParser());

app.use(requestLogger); // подключаем логгерзапросов

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/),
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

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
});

app.listen(PORT);
