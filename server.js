const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Настройка шаблонизатора Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// Подключаем статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Middleware для парсинга JSON и формы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Загрузка данных из users.json
const rawData = fs.readFileSync(path.join(__dirname, 'src/data', 'users.json'), 'utf-8');
const usersData = JSON.parse(rawData);

// Список пользователей
const users = usersData.map(user => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    birthDate: user.birthDate,
    email: user.email,
    status: user.status,
    role: user.role,
    friends: user.friends
}));

// Список постов всех пользователей
const posts = usersData.flatMap(user => user.posts.map(post => ({
    ...post,
    userId: user.id,
    username: user.username,
    avatar: user.avatar
})));

// Функция для загрузки данных пользователей
function loadUsers() {
    const data = fs.readFileSync(path.join(__dirname, 'src/data/users.json'), 'utf-8');
    return JSON.parse(data);
}

// Главная страница
app.get('/', (req, res) => {
    const users = loadUsers();
    res.render('index', { title: 'Social Network', users });
});

// Страница профиля пользователя
app.get('/user/:id', (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        const friends = users.filter(u => user.friends.includes(u.id));
        res.render('user', { user, friends });
    } else {
        res.status(404).send('User not found');
    }
});

// Админ-панель для всех пользователей
app.get('/admin', (req, res) => {
    const users = loadUsers();
    res.render('admin', { users });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/admin/users', (req, res) => {
    const users = loadUsers();
    res.render('users', { users });
});

app.get('/admin/news', (req, res) => {
    const users = loadUsers();
    res.render('news', { users });
});

app.get('/user/:id/friends', (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        const friends = users.filter(u => user.friends.includes(u.id));
        res.render('friends', { user, friends });
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/user/:id/news', (req, res) => {
    const users = loadUsers();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
        const friends = users.filter(u => user.friends.includes(u.id));
        res.render('userNews', { user, friends });
    } else {
        res.status(404).send('User not found');
    }
});

// Маршрут для /news
app.get('/news', (req, res) => {
    res.render('news', { posts });
});

// Маршрут для /users
app.get('/users', (req, res) => {
    res.render('users', { users });
});

// Маршрут для списка друзей пользователя
app.get('/friends/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users.find(u => u.id === parseInt(userId));
    const friends = user ? user.friends : null;
    res.render('friends', { user, friends });
});

// Обработчик для несуществующих страниц
app.use((req, res, next) => {
    res.status(404).render('404', { url: req.url });
});