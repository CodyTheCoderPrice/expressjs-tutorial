import express, { response } from 'express';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const mockUsers = [
	{ id: 1, username: 'anson', displayName: 'Anson' },
	{ id: 2, username: 'jack', displayName: 'Jack' },
	{ id: 3, username: 'anna', displayName: 'Anna' },
	{ id: 4, username: 'tina', displayName: 'Tina' },
	{ id: 5, username: 'jason', displayName: 'Jason' },
	{ id: 6, username: 'henry', displayName: 'Henry' },
	{ id: 7, username: 'marilyn', displayName: 'Marilyn' },
];

app.get('/api/users', (req, res) => {
	const { filter, value } = req.query;

	if (filter && value) {
		return res.send(mockUsers.filter((user) => user[filter].includes(value)));
	}

	return res.send(mockUsers);
});

app.post('/api/users', (req, res) => {
	const { body } = req;
	const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
	mockUsers.push(newUser);
	return res.status(201).send(newUser);
});

app.get('/api/users/:id', (req, res) => {
	const parsedId = parseInt(req.params.id);
	if (isNaN(parsedId)) {
		return res.status(400).send({ msg: 'Bad Request. Invalid ID.' });
	}
	const findUser = mockUsers.find((user) => user.id === parsedId);
	if (!findUser) return res.sendStatus(404);
	return res.send(findUser);
});

app.put('/api/users/:id', (req, res) => {
	const {
		body,
		params: { id },
	} = req;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return res.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return res.sendStatus(404);
	mockUsers[findUserIndex] = { id: parsedId, ...body };
	return res.sendStatus(200);
});

app.patch('/api/users/:id', (req, res) => {
	const {
		body,
		params: { id },
	} = req;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return res.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return res.sendStatus(404);
	mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
	return res.sendStatus(200);
});

app.delete('/api/users/:id', (req, res) => {
	const { id } = req.params;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return res.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return res.sendStatus(404);
	mockUsers.splice(findUserIndex, 1);
	return res.sendStatus(200);
});

app.get('/api/products', (req, res) => {
	res.send([{ id: 123, name: 'chicekn breast', price: 12.99 }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
