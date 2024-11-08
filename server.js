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

// Функция для загрузки данных пользователей
function loadUsers() {
    const data = fs.readFileSync(path.join(__dirname, 'src/data/users.json'), 'utf-8');
    return JSON.parse(data);
}

function getPosts() {
    const usersData = loadUsers();
    return usersData.flatMap(user => user.posts.map(post => ({
        ...post,
        userId: user.id,
        username: user.username,
        avatar: user.avatar
    })));
}

// New function to save updated users data back to the JSON file
function saveUsers(usersData) {
    fs.writeFileSync(path.join(__dirname, 'src/data/users.json'), JSON.stringify(usersData, null, 2), 'utf8');
}

// Главная страница
app.get('/', (req, res) => {
    res.redirect("/admin/users")
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/admin/users', (req, res) => {
    const users = loadUsers();
    res.render('users', { users });
});

app.get('/admin/news', (req, res) => {
    const posts = getPosts().sort((a, b) => new Date(b.date) - new Date(a.date));
    res.render('news', { posts });
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

// Route to handle updating a user's information
app.post('/admin/users/:id/update', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { username, email, birthDate, status, role } = req.body;

    // Load users data
    const usersData = loadUsers();

    // Find and update the specified user
    const user = usersData.find(user => user.id === userId);
    if (user) {
        user.username = username;
        user.email = email;
        user.birthDate = birthDate;
        user.status = status;
        user.role = role;

        // Save the updated data back to the file
        saveUsers(usersData);

        // Redirect back to the admin users page
        res.redirect('/admin/users');
    } else {
        // If the user was not found, respond with a 404 error
        res.status(404).send('User not found');
    }
});

app.post('/admin/news/:userId/post/:postId/update-status', (req, res) => {
    const { userId, postId } = req.params;
    const { status } = req.body;
    const users = loadUsers();

    // Find the user and the post to update
    const user = users.find(u => u.id === parseInt(userId));
    if (user) {
        const post = user.posts.find(p => p.id === parseInt(postId));
        if (post) {
            post.status = status;
            saveUsers(users);
        }
    }

    res.redirect('/admin/news'); // Redirect back to the news page after update
});











// Обработчик для несуществующих страниц
app.use((req, res, next) => {
    res.status(404).render('404', { url: req.url });
});
