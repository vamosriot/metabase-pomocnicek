import { getKey } from './util.js';

const AI_ENDPOINTS = {
  openai: 'https://api.openai.com/v1/chat/completions',
  custom: '', // Will be set by user in options
};

class AIService {
  constructor() {
    this.abortController = null;
    this.endpoint = AI_ENDPOINTS.openai;
    this.model = 'gpt-4o-mini';
  }

  async generateSQL(prompt, schema = []) {
    return await this.callAI({
      systemMessage: this.buildSQLSystemMessage(schema),
      userMessage: prompt,
      temperature: 0.1,
    });
  }

  async generateChartDescription(data, context = '') {
    return await this.callAI({
      systemMessage:
        'You are a data visualization expert. Describe the best chart type and configuration for the given data.',
      userMessage: `Data context: ${context}\nData: ${JSON.stringify(data)}`,
      temperature: 0.3,
    });
  }

  async generateDashboardSuggestion(queries, context = '') {
    return await this.callAI({
      systemMessage:
        'You are a dashboard design expert. Suggest dashboard layout and widgets for the given queries.',
      userMessage: `Context: ${context}\nQueries: ${JSON.stringify(queries)}`,
      temperature: 0.4,
    });
  }

  async translateText(text, fromLang, toLang) {
    return await this.callAI({
      systemMessage: `Translate the following text from ${fromLang} to ${toLang}. Preserve technical terms and SQL keywords.`,
      userMessage: text,
      temperature: 0.1,
    });
  }

  buildSQLSystemMessage(schema) {
    const baseMessage =
      'You are a senior analytics engineer. Return ONLY valid, runnable SQL for Metabase.';

    if (schema.length === 0) {
      return baseMessage;
    }

    return [baseMessage, 'Here is the database schema JSON:', JSON.stringify(schema, null, 0)].join(
      '\n'
    );
  }

  async callAI({ systemMessage, userMessage, temperature = 0.1, maxRetries = 3 }) {
    const apiKey = await getKey();
    if (!apiKey) {
      throw new Error('API key not found. Please set it in options.');
    }

    // Cancel previous request if still running
    if (this.abortController) {
      this.abortController.abort();
    }

    this.abortController = new AbortController();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            temperature,
            messages: [
              { role: 'system', content: systemMessage },
              { role: 'user', content: userMessage },
            ],
          }),
          signal: this.abortController.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from AI service');
        }

        return data.choices[0].message.content.trim();
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request was cancelled');
        }

        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff for retries
        await new Promise((resolve) => setTimeout(resolve, 2 ** attempt * 1000));
      }
    }
  }

  setEndpoint(endpoint, model = 'gpt-4o-mini') {
    this.endpoint = endpoint;
    this.model = model;
  }

  cancel() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export default new AIService();
