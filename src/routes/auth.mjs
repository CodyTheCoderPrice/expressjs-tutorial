import { Router } from 'express';
import passport from 'passport';
import { mockUsers } from '../utils/constants.mjs';

const router = Router();

router.post('/api/auth', (req, res) => {
	const {
		body: { username, password },
	} = req;
	const findUser = mockUsers.find((user) => user.username === username);
	if (!findUser || findUser.password !== password) {
		return res.status(401).send({ msg: 'Bad Credentials' });
	}
	req.session.user = findUser;
	return res.status(200).send(findUser);
});

router.get('/api/auth/status', (req, res) => {
	return req.session.user
		? res.status(200).send(req.session.user)
		: res.status(401).send({ msg: 'Not Authenticated' });
});

router.post(
	'/api/auth/passport',
	passport.authenticate('local'),
	(req, res) => {
		res.sendStatus(200);
	}
);

router.get('/api/auth/passport/status', (req, res) => {
	return req.user
		? res.status(200).send(req.user)
		: res.status(401).send({ msg: 'Not Authenticated' });
});

router.post('/api/auth/passport/logout', (req, res) => {
	if (!req.user) return res.sendStatus(401);

	req.logout((err) => {
		if (err) return res.sendStatus(400);
		res.sendStatus(200);
	});
});

export default router;
