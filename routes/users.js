const router = require('express').Router();
const { getUsers, getUser, createUser, updateUser, updateAvatar } = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUser); // возвращает пользователя по _id
router.post('/users', createUser); // создаёт пользователя
router.patch('/users/me', updateUser); // обновляет профиль
router.patch('/users/me/avatar', updateAvatar); // обновляет аватар
module.exports = router;