import { Router } from 'express';

const router = Router();

router.get('/api/products', (req, res) => {
	// Uses cookie-parser npm
	console.log(req.cookies);
	console.log(req.signedCookies);
	if (req.signedCookies.shhh && req.signedCookies.shhh === 'this is signed') {
		return res.send([{ id: 123, name: 'chicekn breast', price: 12.99 }]);
	}

	return res.send({ msg: 'Sorry. You need the correct cookie.' });
});

export default router;
