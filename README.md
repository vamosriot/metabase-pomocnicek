# Metabase AI Helper

A Chrome extension that adds AI-powered features to Metabase, helping you write SQL queries, generate charts, create dashboards, and translate content.

## Features

- 🧠 **AI SQL Generation**: Describe what you want in natural language and get SQL queries
- 📊 **Chart Suggestions**: Get AI recommendations for the best chart types
- 📈 **Dashboard Creation**: Generate dashboard layouts and widget suggestions
- 🌐 **Translation**: Translate content between Czech and English
- ⚡ **Quick Actions**: Copy to clipboard and run queries directly
- 🔧 **Flexible AI**: Switch between OpenAI and custom/local AI endpoints

## Installation

### For Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd metabase-ai-helper
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked" and select the `dist` folder

### For Production

1. Download the latest release from the Chrome Web Store (coming soon)
2. Or download the `.crx` file from the releases page

## Configuration

### API Key Setup

1. Right-click the extension icon and select "Options"
2. Enter your OpenAI API key (starts with `sk-`)
3. Click "Save"

### Metabase Domain

The extension automatically detects common Metabase patterns:
- `*.metabaseapp.com`
- `*.metabase.com`
- `*/metabase/*` (for self-hosted instances)

For custom domains, you may need to manually add them to the manifest.

## Usage

### SQL Generation

1. Open any Metabase query editor
2. Click the "💡 AI" button that appears in the editor
3. Describe your query in natural language
4. The AI will generate SQL and copy it to your clipboard
5. Paste it into the editor

### Chart & Dashboard Generation

1. Select data or query results
2. Use the extension popup (click the extension icon)
3. Choose "Generate Chart" or "Generate Dashboard"
4. Get AI-powered recommendations

### Translation

1. Select text in Metabase
2. Open the extension popup
3. Click "Translate" to switch between Czech and English

## Development

### Project Structure

```
├── src/                   # Source code
│   ├── components/        # React components
│   ├── services/          # AI service and API handlers
│   ├── utils/             # Utility functions (util.js, schema.js)
│   ├── content/           # Content scripts for Metabase integration
│   ├── background/        # Background service worker
│   ├── popup/             # Extension popup (UI + logic)
│   └── options/           # Options page (UI + logic)
├── public/                # Static assets
│   └── icons/             # Extension icons (16.svg, 128.svg)
├── tests/                 # Test files and setup
│   ├── setupTests.js      # Jest configuration and mocks
│   └── utils.test.js      # Utility function tests
├── _locales/              # Internationalization
│   ├── en/                # English translations
│   └── cs/                # Czech translations
├── docs/                  # Documentation
│   └── privacy.html       # Privacy policy
├── dist/                  # Built extension (generated)
├── manifest.json          # Extension manifest
├── vite.config.js         # Build configuration
├── jest.config.js         # Test configuration
├── .eslintrc.js           # Linting rules
├── .prettierrc            # Code formatting
└── package.json           # Dependencies and scripts
```

### Available Scripts

- `npm run dev` - Build and watch for changes
- `npm run build` - Build for production
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

### Building

The project uses Vite for building:

```bash
# Development build with watching
npm run dev

# Production build
npm run build
```

### Testing

Tests use Jest with Chrome API mocks:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

### Environment Variables

Create a `.env` file for local development:

```bash
# Optional: Custom AI endpoint
VITE_AI_ENDPOINT=https://your-ai-api.com/v1/chat/completions

# Optional: Default model
VITE_AI_MODEL=gpt-4o-mini
```

## Configuration Options

### AI Endpoints

The extension supports multiple AI providers:

1. **OpenAI** (default)
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - Models: `gpt-4o-mini`, `gpt-4`, `gpt-3.5-turbo`

2. **Custom/Local**
   - Configure in options page
   - Must be OpenAI-compatible API

### Schema Caching

- Database schema is cached for 24 hours
- Use "Refresh Schema" in options to force update
- Cache is stored locally in browser

## Privacy & Security

- API keys are stored locally in Chrome's sync storage
- Database schema information is cached locally
- Only table/column names are sent to AI service
- No actual data is transmitted
- See [Privacy Policy](docs/privacy.html) for details

## Browser Support

- Chrome 114+ (Manifest V3 required)
- Other Chromium-based browsers (Edge, Brave, etc.)

## Troubleshooting

### Common Issues

1. **Extension not loading**
   - Check Chrome version (114+ required)
   - Ensure developer mode is enabled
   - Check console for errors

2. **AI not responding**
   - Verify API key is set correctly
   - Check network connection
   - Try refreshing the page

3. **Metabase not detected**
   - Ensure you're on a supported Metabase domain
   - Check content script injection in DevTools

### Debug Mode

Enable debug logging by setting in console:
```javascript
localStorage.setItem('metabase-ai-debug', 'true')
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass: `npm test`
6. Lint your code: `npm run lint:fix`
7. Submit a pull request

### Code Style

- ESLint with Airbnb base configuration
- Prettier for formatting
- Jest for testing
- Conventional commits

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- Create an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section

## Roadmap

- [ ] Support for more AI providers (Anthropic, Azure OpenAI)
- [ ] Advanced query optimization suggestions
- [ ] Query performance analysis
- [ ] Custom prompt templates
- [ ] Team collaboration features
- [ ] Query history and favorites 