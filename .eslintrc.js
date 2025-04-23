module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "react-hooks", "react-refresh", "jsx-a11y", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    quotes: ["error", "double"],
    "prettier/prettier": "warn",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // optional：
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react/prop-types": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
