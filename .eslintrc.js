module.exports = {
  extends: process.env.REACT_APP_DEV_DISABLE_ESLINT ? [] : ['react-app', 'airbnb-typescript'],
  rules: process.env.REACT_APP_DEV_DISABLE_ESLINT ? {} : {
    'react/jsx-props-no-spreading': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
      selector: 'enum',
      format: ['UPPER_CASE']
    }]
  },
  parserOptions: process.env.REACT_APP_DEV_DISABLE_ESLINT ? {} : {
    project: './tsconfig.json',
  }
};
