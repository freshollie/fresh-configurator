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
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unnecessary-condition": [
      "error",
      { allowConstantLoopConditions: true },
    ],
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
    "import/named": "off",
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
          "**/e2e/**/*.{ts,tsx,js}",
          "**/webpack/*.js",
          "**/.storybook/*.{js,ts}",
          "**/__mocks__/**/*.{ts,tsx}",
          "**/jest.*.js",
          "**/storyshots*.ts",
        ],
      },
    ],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/array-type": ["error", { default: "array" }],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error",
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-inferrable-types": "error",
  },
  parserOptions: {
    project: "./tsconfig.eslint.json",
    warnOnUnsupportedTypeScriptVersion: false,
  },
  overrides: [
    {
      files: ["**/*.spec.{ts,tsx}", "**/__mocks__/**/*"],
      env: {
        jest: true,
      },
      rules: {
        "@typescript-eslint/explicit-function-return-type": "off",
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
        "@typescript-eslint/no-unused-vars": "off",
        "functional/no-class": "off",
        "no-shadow": "off",
      },
    },
    {
      files: ["*.js", "*.json"],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unnecessary-condition": "off",
        "@typescript-eslint/prefer-optional-chain": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "import/named": "error",
      },
    },
  ],
};
