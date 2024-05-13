import request from 'supertest';
import mongoose from 'mongoose';
import { createApp } from '../createApp.mjs';

describe('create user and login', () => {
	let app;
	beforeAll(() => {
		mongoose
			.connect('mongodb://localhost/express_tutorial_test')
			.then(() => console.log('Connected to Test Database'))
			.catch((err) => console.log(`Error: ${err}`));

		app = createApp();
	});

	it('should create the user', async () => {
		const res = await request(app).post('/api/db/users').send({
			username: 'adam123',
			displayName: 'Adam The Developer',
			password: 'password',
		});
		expect(res.statusCode).toBe(201);
	});

	it('should log the user in', async () => {
		const res = await request(app).post('/api/auth/passport/local').send({
			username: 'adam123',
			password: 'password',
			displayName: 'Adam The Developer',
		});
		expect(res.statusCode).toBe(200);
	});

	it('should log the user in and visit /api/auth/passport/status and return auth user', async () => {
		const res = await request(app)
			.post('/api/auth/passport/local')
			.send({ username: 'adam123', password: 'password' })
			.then((res) => {
				return request(app)
					.get('/api/auth/passport/status')
					.set('Cookie', res.headers['set-cookie']);
			});
		expect(res.statusCode).toBe(200);
		expect(res.body.username).toBe('adam123');
		expect(res.body.displayName).toBe('Adam The Developer');
	});

	afterAll(async () => {
		await mongoose.connection.dropDatabase();
		await mongoose.connection.close();
	});
});
