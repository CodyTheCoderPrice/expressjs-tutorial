import { Router } from 'express';
import usersRouter from './users.mjs';
import productsRouter from './products.mjs';
import authRouter from './auth.mjs';
import cartRouter from './cart.mjs';
import usersDbRouter from './usersDB.mjs';

const router = Router();

router.use(usersRouter);
router.use(productsRouter);
router.use(authRouter);
router.use(cartRouter);
router.use(usersDbRouter);

export default router;
