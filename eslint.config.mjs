// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',// 允许使用any类型
      '@typescript-eslint/no-floating-promises': 'off', // 允许返回promise
      '@typescript-eslint/no-unsafe-argument': 'off', // 允许传入any类型参数
      '@typescript-eslint/interface-name-prefix': 'off', // 允许接口名不加前缀I
      '@typescript-eslint/explicit-function-return-type': 'off',// 允许函数不指定返回类型
      '@typescript-eslint/explicit-module-boundary-types': 'off', // 允许模块不指定类型
      '@typescript-eslint/no-unsafe-return': 'off', // 允许返回any类型
      '@typescript-eslint/no-unsafe-call': 'off',// 允许调用any类型函数
      '@typescript-eslint/no-unsafe-member-access': 'off',// 允许访问any类型属性
      '@typescript-eslint/no-unsafe-assignment': 'off',// 允许赋值any类型
      '@typescript-eslint/await-thenable': 'off',// 允许await PromiseLike对象
      '@typescript-eslint/no-unused-vars': 0, // 警告未使用的变量
      "prettier/prettier": [
        "error",
        {
          "singleQuote": true,// 使用单引号
          "trailingComma": "none", // 末尾逗号
          "endOfLine": "auto",// 换行符
          "semi": false, // 结尾不加分号
          "arrowParens": "avoid"// 箭头函数只有一个参数，省略括号
        }
      ]
    },
  },
);