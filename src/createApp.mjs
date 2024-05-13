import 'dotenv/config';
import express from 'express';
import routes from './routes/index.mjs';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import './strategies/shared-strategy.mjs';
import './strategies/local-strategy.mjs';
import './strategies/discord-strategy.mjs';

export function createApp() {
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
			// Stores session in DB instead of memory
			store: MongoStore.create({
				client: mongoose.connection.getClient(),
			}),
		})
	);
	// Must be after session middleware but before routes
	app.use(passport.initialize());
	app.use(passport.session());

	// Must be after middleware
	app.use(routes);

	app.get('/', (req, res) => {
		console.log(req.session);
		console.log(req.session.id);
		req.session.visited = true;
		res.cookie('hello', 'world', { maxAge: 60000 * 60 });
		res.cookie('shhh', 'this is signed', { maxAge: 60000 * 60, signed: true });
		res.send('Hello World!');
	});

	return app;
}
