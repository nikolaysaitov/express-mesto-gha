const Card = require('../models/card');

// GET /cards — возвращает все карточки
module.exports.getCards = (_req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Ошибка' }));
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Некорректные данные при создании карточки' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: '_id карточки не найден.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(404)
          .send({ message: 'Пользователь по _id не найден' });
      }
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Некорректные данные для удаления' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию.' });
    });
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        return res
          .status(404)
          .send({ message: 'Не найдена карточка с переданным _id.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для постановки/снятии лайка',
          });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Несуществующий _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });

// DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res) =>
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card === null) {
        return res
          .status(404)
          .send({ message: 'Не найдена карточка с переданным _id.' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные для постановки/снятии лайка',
          });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Несуществующий _id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка' });
    });
