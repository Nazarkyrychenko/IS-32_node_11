const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

const app = express();
const group = express.Router();

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Налаштування
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

// Обробка параметра ID
group.param('id', (req, res, next, id) => {
	if (id * 1 > data.length) {
		return res.status(404).send("Такої особи не існує");
	}
	next();
});

// Сторінка однієї особи
group.get('/:id', (req, res) => {
	const id = req.params.id * 1;
	const person = data.find(el => el.id === id);

	res.render('template-one', {
		fullName: person.fullName,
		from: person.from,
		age: person.age,
		email: person.email,
		description: person.description
	});
});

// Головна сторінка — список усіх
app.get('/', (req, res) => {
	res.render('template-three', {
		people: data
	});
});

// Підключаємо маршрут
app.use('/api/group-overview', group);

// 404
app.use((req, res) => {
	res.status(404).send("Цю сторінку не знайдено 😢");
});

// Запуск сервера
app.listen(3000, () => {
	console.log("Сервер працює на http://localhost:3000");
});
