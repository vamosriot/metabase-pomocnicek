import '@testing-library/jest-dom';

// Mock Chrome APIs
global.chrome = {
  storage: {
    sync: {
      get: jest.fn().mockImplementation(() => Promise.resolve({})),
      set: jest.fn().mockImplementation(() => Promise.resolve()),
    },
    local: {
      get: jest.fn().mockImplementation(() => Promise.resolve({})),
      set: jest.fn().mockImplementation(() => Promise.resolve()),
      remove: jest.fn().mockImplementation(() => Promise.resolve()),
    },
  },
  runtime: {
    sendMessage: jest.fn(),
    onMessage: {
      addListener: jest.fn(),
    },
    getManifest: jest.fn().mockReturnValue({ version: '1.0.0' }),
  },
  tabs: {
    query: jest.fn().mockImplementation(() => Promise.resolve([])),
  },
  scripting: {
    executeScript: jest.fn().mockImplementation(() => Promise.resolve([])),
  },
};

// Mock fetch
global.fetch = jest.fn(); 