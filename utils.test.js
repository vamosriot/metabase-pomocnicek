import { getKey, setKey } from './util.js';

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getKey', () => {
    it('should return empty string when no key is stored', async () => {
      chrome.storage.sync.get.mockResolvedValue({});
      const result = await getKey();
      expect(result).toBe('');
    });

    it('should return stored API key', async () => {
      const testKey = 'test-api-key-123';
      chrome.storage.sync.get.mockResolvedValue({ openaiKey: testKey });
      const result = await getKey();
      expect(result).toBe(testKey);
    });
  });

  describe('setKey', () => {
    it('should store the API key', async () => {
      const testKey = 'test-api-key-456';
      await setKey(testKey);
      expect(chrome.storage.sync.set).toHaveBeenCalledWith({
        openaiKey: testKey,
      });
    });
  });
}); 