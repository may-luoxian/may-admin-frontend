module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:vue/vue3-essential'],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': ['.eslintrc.{js,cjs}'],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parserOptions': {
    'ecmaVersion': 'latest',
    'parser': '@typescript-eslint/parser',
    'sourceType': 'module',
  },
  'plugins': ['@typescript-eslint', 'vue', 'prettier'],
  'rules': {
    'prettier/prettier': 'warn',
    '@typescript-eslint/no-explicit-any': 'off', //关闭any类型警告
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
