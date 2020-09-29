module.exports = {
  rootDir: './src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  moduleNameMapper: {
    '^@constants(.*)$': '<rootDir>/constants/$1',
    '^@shared(.*)$': '<rootDir>/api/shared/$1',
    '^@entities(.*)$': '<rootDir>/entities/$1',
    '^@utils(.*)$': '<rootDir>/utils/$1',
  }
};