module.exports = {
  extends: ['react-app', 'airbnb-typescript'],
  "ignorePatterns": ['lib/*'],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    'react/jsx-one-expression-per-line': 'off',
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "**/*.test.ts",
          "**/*.test.tsx",
          "**/*.spec.tsx",
          "src/setupTests.ts",
          "src/reportWebVitals.ts"
        ]}
      ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
      selector: 'enum',
      format: ['UPPER_CASE']
    }],
    'arrow-body-style': 'off'
  },
  parserOptions: {
    project: './tsconfig.json',
  }
};
