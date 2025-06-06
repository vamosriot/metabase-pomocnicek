export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '<rootDir>/**/*.{test,spec}.{js,jsx}',
  ],
  collectCoverageFrom: [
    '*.{js,jsx}',
    '!*.d.ts',
    '!setupTests.js',
    '!jest.config.js',
    '!vite.config.js',
    '!babel.config.js',
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