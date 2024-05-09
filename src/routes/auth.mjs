import { Router } from 'express';
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

router.get('/api/cart', (req, res) => {
	if (!req.session.user) return res.sendStatus(401);
	return res.send(req.session.cart ?? []);
});

router.post('/api/cart', (req, res) => {
	if (!req.session.user) return res.sendStatus(401);
	const { body: item } = req;
	const { cart } = req.session;
	if (cart) {
		cart.push(item);
	} else {
		req.session.cart = [item];
	}
	return res.status(201).send(item);
});

export default router;
