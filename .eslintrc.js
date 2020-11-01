module.exports = {
  extends: ['react-app', 'airbnb-typescript'],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
      selector: 'enum',
      format: ['UPPER_CASE']
    }]
  },
  parserOptions: {
    project: './tsconfig.json',
  }
};
