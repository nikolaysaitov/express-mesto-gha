const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUser); // возвращает пользователя по _id
// router.post('/users', createUser); //удалите обработчик создания пользователя, он больше не нужен
router.patch('/users/me', updateUser); // обновляет профиль
router.patch('/users/me/avatar', updateAvatar); // обновляет аватар
router.get('/users/me', getUserInfo); // GET /users/me - возвращает информацию о текущем пользователе
module.exports = router;
