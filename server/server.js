const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Если ваш API нужен, вы можете добавить API-эндпоинты до отдачи статики.
// Например:
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from API' });
});

// Отдаем статику из папки build, которая находится в клиентском приложении.
// Путь: поднимаемся на уровень выше (из server в корень), затем в client/build.
app.use(express.static(path.join(__dirname, '../client/build')));

// Все остальные запросы направляем на index.html для поддержки React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
