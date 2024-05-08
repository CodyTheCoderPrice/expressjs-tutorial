import express, { Router } from 'express';
import { validationResult, matchedData, checkSchema } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { mockUsers } from '../utils/constants.mjs';

const router = Router();

const resolveIndexByUserId = (req, res, next) => {
	const {
		params: { id },
	} = req;
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) return res.sendStatus(400);
	const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
	if (findUserIndex === -1) return res.sendStatus(404);
	req.findUserIndex = findUserIndex;
	next();
};

router.use(express.json());

router.get('/api/users', (req, res) => {
	const { filter, value } = req.query;
	if (filter && value) {
		return res.send(mockUsers.filter((user) => user[filter].includes(value)));
	}
	return res.send(mockUsers);
});

router.post(
	'/api/users',
	checkSchema(createUserValidationSchema),
	(req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).send({ errors: result.array() });
		}
		const data = matchedData(req);
		const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
		mockUsers.push(newUser);
		return res.status(201).send(newUser);
	}
);

router.get('/api/users/:id', resolveIndexByUserId, (req, res) => {
	const { findUserIndex } = req;
	return res.send(mockUsers[findUserIndex]);
});

router.put('/api/users/:id', resolveIndexByUserId, (req, res) => {
	const { body, findUserIndex } = req;
	mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
	return res.sendStatus(200);
});

router.patch('/api/users/:id', resolveIndexByUserId, (req, res) => {
	const { body, findUserIndex } = req;
	mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
	return res.sendStatus(200);
});

router.delete('/api/users/:id', resolveIndexByUserId, (req, res) => {
	const { findUserIndex } = req;
	mockUsers.splice(findUserIndex, 1);
	return res.sendStatus(200);
});

export default router;
