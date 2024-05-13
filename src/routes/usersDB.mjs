import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { createUserValidationSchema } from '../utils/validationSchemas.mjs';
import { createDbUserHandler } from '../handlers/usersDB.mjs';

const router = Router();

router.post(
	'/api/db/users',
	checkSchema(createUserValidationSchema),
	createDbUserHandler
);

export default router;
