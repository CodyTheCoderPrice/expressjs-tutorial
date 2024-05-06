import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const mockUsers = [
	{ id: 1, username: 'anson', displayName: 'Anson' },
	{ id: 2, username: 'jack', displayName: 'Jack' },
	{ id: 3, username: 'adam', displayName: 'Adam' },
];

app.get('/api/users', (req, res) => {
	res.send(mockUsers);
});

app.get('/api/users/:id', (req, res) => {
	const parsedId = parseInt(req.params.id);
	console.log(parsedId);
	if (isNaN(parsedId)) {
		return res.status(400).send({ msg: 'Bad Request. Invalid ID.' });
	}

	const findUser = mockUsers.find((user) => user.id === parsedId);
	if (!findUser) return res.sendStatus(404);

	return res.send(findUser);
});

app.get('/api/products', (req, res) => {
	res.send([{ id: 123, name: 'chicekn breast', price: 12.99 }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
