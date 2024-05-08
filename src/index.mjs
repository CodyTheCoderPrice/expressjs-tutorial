import 'dotenv/config';
import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';

const app = express();

// MIDDLEWARE
app.use(express.json());
// param secret needed for signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Must be after middleware
app.use(routes);

app.get('/', (req, res) => {
	res.cookie('hello', 'world', { maxAge: 60000 });
	res.cookie('shhh', 'this is signed', { maxAge: 60000, signed: true });
	res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on Port: ${PORT}`);
});
