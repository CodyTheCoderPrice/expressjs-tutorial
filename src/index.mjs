import express from 'express';
import routes from './routes/index.mjs';

const app = express();

app.use(routes);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on Port: ${PORT}`);
});
