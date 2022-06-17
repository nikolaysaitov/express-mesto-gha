// app.js — входной файл

const express = require('express');
const { PORT = 3000 } = process.env;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// подключаем мидлвары, роуты и всё остальное...
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62aa5038e6a8d6f9863920ff' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', require('./routes/users'));

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening port ${PORT}`)
})


// _id 62aa5038e6a8d6f9863920ff
//  {
//   "name":"ропрпь",
//   "about":"олло",
//   "avatar":"https://doctor-veterinar.ru/media/k2/items/cache/675d28c04794e3c683f4419536c4c15f_XL.jpg"
// }
