import { getUserByIdHandler } from '../handlers/users.mjs';
import { mockUsers } from '../utils/constants.mjs';

const mockReq = {
	findUserIndex: 1,
};
const mockRes = {
	sendStatus: jest.fn(),
	send: jest.fn(),
};

describe('get users', () => {
	it('should get user by id', () => {
		getUserByIdHandler(mockReq, mockRes);
		expect(mockRes.send).toHaveBeenCalled();
		expect(mockRes.send).toHaveBeenCalledWith(mockUsers[mockReq.findUserIndex]);
		expect(mockRes.send).toHaveBeenCalledTimes(1);
	});

	it('should call sendStatus with 404 when user not found', () => {
		const faultyMockReq = { ...mockReq, findUserIndex: -1 };
		getUserByIdHandler(faultyMockReq, mockRes);
		expect(mockRes.sendStatus).toHaveBeenCalled();
		expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
		expect(mockRes.sendStatus).toHaveBeenCalledTimes(1);
		expect(mockRes.send).not.toHaveBeenCalled();
	});
});
