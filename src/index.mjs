import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
	res.send([
		{ id: 1, username: 'anson', displayName: 'Anson' },
		{ id: 2, username: 'jack', displayName: 'Jack' },
		{ id: 3, username: 'adam', displayName: 'Adam' },
	]);
});

app.get('/api/products', (req, res) => {
	res.send([{ id: 123, name: 'chicekn breast', price: 12.99 }]);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
