const User = require('../models/user');

// GET /users — возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Ошибка 500' }));
};

// GET /users/:userId - возвращает пользователя по _id
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        return res
          .status(404)
          .send({ message: 'Пользователь по указанному Id не найден.' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Передан некорректный Id' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

// POST /users — создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании user' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

// PATCH /users/me — обновляет профиль
module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при обновлении профиля' });
        return;
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};

// PATCH /users/me/avatar — обновляет аватар
module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.body._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные при обновлении аватара' });
        return;
      }
      res.status(500).send({ message: 'Ошибка' });
    });
};

