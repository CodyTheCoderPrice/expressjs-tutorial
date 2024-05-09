export const createUserValidationSchema = {
	username: {
		notEmpty: { errorMessage: 'Username cannot be empty' },
		isString: { errorMessage: 'Username must be a string' },
		isLength: {
			options: { min: 3, max: 32 },
			errorMessage: 'Username must be 3-32 characters',
		},
	},
	displayName: {
		notEmpty: { errorMessage: 'DisplayName cannot be empty' },
		isString: { errorMessage: 'DisplayName must be a string' },
		isLength: {
			options: { min: 3, max: 32 },
			errorMessage: 'DisplayName must be 3-32 characters',
		},
	},
	password: {
		notEmpty: { errorMessage: 'Password cannot be empty' },
		isString: { errorMessage: 'Password must be a string' },
		isLength: {
			options: { min: 5, max: 20 },
			errorMessage: 'password must be 5-20 characters',
		},
	},
};
