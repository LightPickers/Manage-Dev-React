// eslint.config.js
import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import reactRefresh from "eslint-plugin-react-refresh";
import babelParser from "@babel/eslint-parser";

/** @type {import("eslint").Config[]} */
export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "build", "dist"],
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        // 瀏覽器基礎全域物件
        window: "readonly",
        document: "readonly",
        console: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        FormData: "readonly",
        URLSearchParams: "readonly",

        // 計時器
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",

        // 瀏覽器 API
        localStorage: "readonly",
        sessionStorage: "readonly",
        location: "readonly",
        navigator: "readonly",
        history: "readonly",
        fetch: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MutationObserver: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      prettier,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        alias: {
          map: [
            ["@", "./src"],
            ["@pages", "./src/pages"],
            ["@components", "./src/components"],
            ["@layouts", "./src/layouts"],
            ["@routes", "./src/routes"],
            ["@assets", "./src/assets"],
            ["@features", "./src/features"],
            ["@hooks", "./src/hooks"],
            ["@schemas", "./src/schemas"],
            ["@utils", "./src/utils"],
          ],
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".svg"],
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".svg"],
        },
      },
    },
    rules: {
      quotes: ["error", "double"],
      "prettier/prettier": ["error", { endOfLine: "lf" }],
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "error",
      "no-unused-vars": ["warn", { varsIgnorePattern: ".*", argsIgnorePattern: ".*" }],
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        {
          groups: [["builtin", "external"], "internal", ["parent", "sibling", "index"]],
          "newlines-between": "always",
        },
      ],
    },
  },
  {
    files: ["*.config.js", "*.config.mjs", "*.config.cjs"],
    languageOptions: {
      env: {
        node: true,
      },
    },
  },
];
