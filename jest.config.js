export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  testMatch: [
    '<rootDir>/tests/**/*.{test,spec}.{js,jsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!tests/setupTests.js',
  ],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  globals: {
    chrome: {
      storage: {
        sync: {
          get: jest.fn(),
          set: jest.fn(),
        },
        local: {
          get: jest.fn(),
          set: jest.fn(),
          remove: jest.fn(),
        },
      },
      runtime: {
        sendMessage: jest.fn(),
        onMessage: {
          addListener: jest.fn(),
        },
      },
      tabs: {
        query: jest.fn(),
      },
    },
  },
}; 