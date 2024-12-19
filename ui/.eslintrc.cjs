module.exports = {
  env: { browser: true, es2020: true, node: true, jest: true }, // Añadido 'jest: true'
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended', // Añadido 'plugin:jest/recommended'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh', 'jest'], // Añadido 'jest'
  rules: {
    'react-refresh/only-export-components': 'warn',
    "react/prop-types": "off",
  },
}

