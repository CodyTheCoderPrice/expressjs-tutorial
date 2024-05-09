import { Router } from 'express';
import { validationResult, matchedData, checkSchema } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { User } from '../mongoose/schemas/user.mjs';

const router = Router();

router.post(
	'/api/db/users',
	checkSchema(createUserValidationSchema),
	async (req, res) => {
		const result = validationResult(req);
		if (!result.isEmpty()) {
			return res.status(400).send({ errors: result.array() });
		}
		const data = matchedData(req);
		const newUser = new User(data);
		try {
			const savedUser = await newUser.save();
			return res.status(201).send(savedUser);
		} catch (err) {
			return res.status(400).send({ msg: err.errmsg });
		}
	}
);

export default router;
