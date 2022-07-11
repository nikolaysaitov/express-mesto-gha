const Card = require('../models/card');
const ValidError = require('../errors/validation_error_400');
const ForbiddenError = require('../errors/forbidden_403');
const NotFoundError = require('../errors/not-found-err_404');

// GET /cards — возвращает все карточки
module.exports.getCards = (_req, res, next) => {
  Card.find({})
    .then((cards) => res.send({
      data: cards,
    }))
    .catch((err) => {
      next(err);
    });
};

// POST /cards — создаёт карточку
module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidError('Введены некорректные данные'));
      }
      return next(err);
    });
};

// DELETE /cards/:cardId — удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка отсутствует');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Это чужая карточка, ее нельзя удалить');
      } else {
        return card.remove()
          .then(() => res.send({
            message: 'Карточка удалена',
          }));
      }
    }).catch(next);
};

// PUT /cards/:cardId/likes — поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка отсутствует');
      }
      return res.send({ data: card });
    })
    .catch(next);
};

// // DELETE /cards/:cardId/likes — убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка отсутствует');
      }
      return res.send({ data: card });
    })
    .catch(next);
};
