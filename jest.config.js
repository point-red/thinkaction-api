module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files with ts-jest
    '^.+\\.jsx?$': 'babel-jest', // Transform JavaScript files with babel-jest
  },
  testMatch: ['**/**/*.test.ts'],
};
