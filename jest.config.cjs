module.exports = {
  testEnvironment: 'jsdom',
  testMatch: [
    '<rootDir>/**/*.{test,spec}.{js,jsx}',
  ],
  collectCoverageFrom: [
    '*.{js,jsx}',
    '!*.d.ts',
    '!setupTests.js',
    '!jest.config.cjs',
    '!babel.config.cjs',
    '!vite.config.js',
  ],
}; 