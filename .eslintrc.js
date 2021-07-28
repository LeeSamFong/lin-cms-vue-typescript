module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'vue/custom-event-name-casing': 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    'vue/experimental-script-setup-vars': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-shadow': 0,
    'no-plusplus': 0, // 禁止使用++，--
    'guard-for-in': 0,
    'no-extra-semi': 0, // 和prettier冲突
    'import/extensions': 0, // import不需要写文件扩展名
    semi: ['error', 'never'], // 无分号
    'import/no-unresolved': 0,
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0, // 无下划线
    'consistent-return': 'off',
    'max-len': ['error', { code: 200 }],
    'no-use-before-define': 'off',
    'no-prototype-builtins': 'off',
    'class-methods-use-this': 'off',
    'template-curly-spacing': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'comma-dangle': ['error', 'only-multiline'],
    'no-param-reassign': ['error', { props: false }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['script/**/*.js'] }],
    indent: [
      'warn',
      2,
      {
        ignoredNodes: ['TemplateLiteral'],
        SwitchCase: 1,
      },
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectPattern: { multiline: true },
        ImportDeclaration: 'never',
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    camelcase: 'off',
    'symbol-description': 'off',
    'import/named': 'off',
    'no-continue': 'off',
    'no-unused-expressions': 'off',
    'import/no-cycle': 'off',
    'no-multiple-empty-lines': ['error', { max: 2 }],
  },
}
