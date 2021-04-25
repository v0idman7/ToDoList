module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  extends: ['airbnb'],
  plugins: [
    'babel',
    'import',
    'jsx-a11y',
    /* 'react',
      'prettier', */
  ],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'linebreak-style': 'off', // Неправильно работает в Windows.

    'max-len': ['warn', 200, 2, { ignoreUrls: true }], // airbnb позволяет некоторые пограничные случаи
    'no-console': 'error', // airbnb использует предупреждение
    'no-tabs': 'warn',

    'no-param-reassign': 'off', // Это - не наш стиль?
    radix: 'off', // parseInt, parseFloat и radix выключены. Мне это не нравится.

    'prefer-destructuring': 'off',

    'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'], specialLink: ['to'] }],
    'jsx-a11y/label-has-for': [2, {
      required: {
        every: ['id'],
      },
    }], // для ошибки вложенных свойств htmlFor элементов label

    /* 'prettier/prettier': ['error'], */
  },
};
