import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
	{
		ignores: ['.react-router/**', 'build/**', 'dist/**', 'node_modules/**', 'public/**'],
	},
	js.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			globals: {
				__dirname: 'readonly',
				__filename: 'readonly',
				Buffer: 'readonly',
				clearInterval: 'readonly',
				clearTimeout: 'readonly',
				console: 'readonly',
				document: 'readonly',
				EventSource: 'readonly',
				exports: 'readonly',
				global: 'readonly',
				module: 'readonly',
				process: 'readonly',
				require: 'readonly',
				setInterval: 'readonly',
				setTimeout: 'readonly',
				window: 'readonly',
			},
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		plugins: {
			'@typescript-eslint': typescript,
			import: importPlugin,
			prettier: prettier,
			react: react,
			'react-hooks': reactHooks,
		},
		rules: {
			...prettierConfig.rules,
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
			'import/order': [
				'error',
				{
					groups: [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
				},
			],
			indent: ['error', 'tab', { SwitchCase: 1 }],
			'no-unused-vars': 'off',
			'prettier/prettier': 'error',
			quotes: ['error', 'single', { avoidEscape: true }],
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
		},
		settings: {
			'import/resolver': {
				node: true,
				typescript: true,
			},
			react: {
				version: 'detect',
			},
		},
	},
];
