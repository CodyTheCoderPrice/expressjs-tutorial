import * as validator from 'express-validator';
import * as helpers from '../utils/helpers.mjs';
import { getUserByIdHandler } from '../handlers/users.mjs';
import { mockUsers } from '../utils/constants.mjs';
import { User } from '../mongoose/schemas/user.mjs';
import { createDbUserHandler } from '../handlers/usersDB.mjs';

const mockArray = [{ msg: 'Invalid Field' }];
const mockMatchedData = {
	username: 'test',
	displayName: 'Test Testington',
	password: 'testing',
};
const mockHashedPassword = `hashed_${mockMatchedData.password}`;
jest.mock('express-validator', () => ({
	validationResult: jest.fn(() => ({
		isEmpty: jest.fn(() => false),
		array: jest.fn(() => mockArray),
	})),
	matchedData: jest.fn(() => ({ ...mockMatchedData })),
}));

jest.mock('../utils/helpers.mjs', () => ({
	hashPassword: jest.fn((password) => `hashed_${password}`),
}));

jest.mock('../mongoose/schemas/user.mjs');

const mockRes = {
	sendStatus: jest.fn(),
	send: jest.fn(),
	// Giving mockRes access to itself to account for chain function calling
	status: jest.fn(() => mockRes),
};

describe('get users', () => {
	const mockReq = {
		findUserIndex: 1,
	};

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

describe('create users in DB', () => {
	const mockReq = {
		findUserIndex: 1,
	};

	it('should return status of 400 when invalid input', async () => {
		await createDbUserHandler(mockReq, mockRes);
		expect(validator.validationResult).toHaveBeenCalled();
		expect(validator.validationResult).toHaveBeenCalledWith(mockReq);
		expect(mockRes.status).toHaveBeenCalledWith(400);
		expect(mockRes.send).toHaveBeenCalledWith(mockArray);
	});

	it('should return status of 201 and create user', async () => {
		jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));
		const saveMethod = jest
			.spyOn(User.prototype, 'save')
			.mockResolvedValueOnce({
				...mockMatchedData,
				id: 1,
				password: mockHashedPassword,
			});
		await createDbUserHandler(mockReq, mockRes);
		expect(validator.matchedData).toHaveBeenCalledWith(mockReq);
		expect(helpers.hashPassword).toHaveBeenCalledWith(mockMatchedData.password);
		expect(helpers.hashPassword).toHaveReturnedWith(mockHashedPassword);
		expect(User).toHaveBeenCalledWith({
			...mockMatchedData,
			password: mockHashedPassword,
		});
		expect(saveMethod).toHaveBeenCalled();
		expect(mockRes.status).toHaveBeenCalledWith(201);
		expect(mockRes.send).toHaveBeenCalledWith({
			...mockMatchedData,
			id: 1,
			password: mockHashedPassword,
		});
	});

	it('send status of 400 when database fails to save user', async () => {
		jest.spyOn(validator, 'validationResult').mockImplementationOnce(() => ({
			isEmpty: jest.fn(() => true),
		}));
		const saveMethod = jest
			.spyOn(User.prototype, 'save')
			.mockImplementationOnce(() => Promise.reject('Failed to save user'));
		await createDbUserHandler(mockReq, mockRes);
		expect(saveMethod).toHaveBeenCalled();
		expect(mockRes.sendStatus).toHaveBeenCalledWith(400);
	});
});
