// eslint.config.js
module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        // Define global variables here if needed
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      // Add other rules directly here
    },
    // Directly include config objects that would be extended
    settings: {
      // Include any settings that are required
    },
  },
];
