module.exports = {
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/*.test.ts'],
	coverageReporters: ['text', 'lcovonly'],
	collectCoverageFrom: ['./src/**/*.ts', '!**/node_modules/**'],
	transform: {
		'^.+\\.ts$': 'ts-jest'
	}
};
