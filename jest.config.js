module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(j|t)sx?$': 'ts-jest',
  },
  modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^lodash-es$': 'lodash',
  },
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  testEnvironment: 'jsdom',
};
