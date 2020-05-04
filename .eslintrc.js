module.exports = {
  plugins: [
    "react",
    "react-hooks",
    "@typescript-eslint",
    "prettier",
    "import",
    "functional",
    "jest",
  ],
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true, allowTypedFunctionExpressions: true },
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "react/prop-types": ["off"],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "functional/no-class": "error",
    "functional/prefer-type-literal": "error",
    "functional/no-this-expression": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.spec.{ts,tsx}",
          "**/*.stories.{ts,tsx}",
          "**/test-utils.{ts,tsx}",
          "**/.jest/*.{ts,tsx,js}",
          "**/webpack.*.js",
          "**/.storybook/*.{js,ts}",
          "**/__mocks__/**/*.{ts,tsx}",
          "**/jest.*.js",
        ],
      },
    ],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "@typescript-eslint/no-require-imports": "error",
  },
  parserOptions: {
    project: "tsconfig.eslint.json",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  overrides: [
    {
      files: ["**/*.spec.{ts,tsx}", "**/__mocks__/**/*"],
      env: {
        jest: true,
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "react/jsx-props-no-spreading": "off",
        "no-constant-condition": "off",
        "no-empty": "off",
        "no-await-in-loop": "off",
      },
    },
    {
      files: ["*.d.ts"],
      rules: {
        // Fix to /// imports in .d.ts
        "spaced-comment": ["error", "always", { markers: ["/"] }],
      },
    },
    {
      files: ["*.js", "*.json"],
      parser: "espree",
      rules: {
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/prefer-includes": "off",
        "@typescript-eslint/prefer-regexp-exec": "off",
        "@typescript-eslint/prefer-string-starts-ends-with": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/unbound-method": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-throw-literal": "off",
      },
    },
  ],
};
