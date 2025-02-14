import { mockUsers } from '../utils/constants.mjs';

export const getUserByIdHandler = (req, res) => {
	const { findUserIndex } = req;
	const findUser = mockUsers[findUserIndex];
	if (!findUser) return res.sendStatus(404);
	return res.send(findUser);
};
