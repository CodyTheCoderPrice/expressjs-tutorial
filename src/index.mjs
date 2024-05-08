import 'dotenv/config';
import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';

const app = express();

// MIDDLEWARE
app.use(express.json());
// param secret needed for signed cookies
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 60000 * 60,
		},
	})
);

// Must be after middleware
app.use(routes);

app.get('/', (req, res) => {
	console.log(req.session);
	console.log(req.session.id);
	req.session.visited = true;
	res.cookie('hello', 'world', { maxAge: 60000 });
	res.cookie('shhh', 'this is signed', { maxAge: 60000, signed: true });
	res.send('Hello World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on Port: ${PORT}`);
});
