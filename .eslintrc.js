module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        // see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
        parser: '@typescript-eslint/parser',
        ecmaFeatures: {
            jsx: true
        },
        useJSXTextNode: true
    },
    extends: [
        // https://eslint.vuejs.org/rules/
        'plugin:vue/recommended',
        // 'standard',
        'plugin:@typescript-eslint/recommended'
    ],
    plugins: [],
    rules: {
        // indent: ['error', 4], // 强制使用一致的缩进
        indent: [4, { SwitchCase: 1 }], // 强制使用一致的缩进
        // 不检查any类型：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-explicit-any.md
        '@typescript-eslint/no-explicit-any': 'off',
        // 不检查属性是否为驼峰命名：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/camelcase.md
        // '@typescript-eslint/camelcase': ['error', { properties: 'never' }],
        '@typescript-eslint/camelcase': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        // 缩进2个空格：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
        // indent: 'off',
        // '@typescript-eslint/indent': ['error', 2],
        // '@typescript-eslint/indent': ['error', 4, { VariableDeclarator: 4, SwitchCase: 1 }],
        // 类型定义的分隔符保持与JS对象一致：https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: { delimiter: 'comma', requireLast: true },
                singleline: { delimiter: 'comma', requireLast: false }
            }
        ],
        // 多行时结尾必须加逗号：https://eslint.org/docs/rules/comma-dangle
        // 'comma-dangle': ['error', 'always-multiline'],
        'comma-dangle': ['error', 'never'],
        // 匿名函数和箭头函数括号前必须加空格，具名函数不需要：https://eslint.org/docs/rules/space-before-function-paren
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always'
            }
        ],
        // 建议Promise.reject的reason使用Error对象：https://eslint.org/docs/rules/prefer-promise-reject-errors
        'prefer-promise-reject-errors': 'off',
        semi: 0
            // 'vue/multi-word-component-names': [
            //     'error',
            //     {
            //         ignores: ['index', 'login'] //需要忽略的组件名
            //     }
            // ]
    }
};