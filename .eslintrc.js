module.exports = {
  plugins: ["react", "react-hooks", "@typescript-eslint", "prettier", "import"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
    "prettier/react",
    "prettier/@typescript-eslint"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false
      }
    ],
    "react/prop-types": ["off"],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "**/*.spec.{ts,tsx}",
          "**/*.stories.{ts,tsx}",
          "**/test-utils.{ts,tsx}",
          "**/.jest/*.{ts,tsx}",
          "**/webpack.*.js",
          "**/.storybook/*.{js,ts}",
          "**/__mocks__/**/*.{ts,tsx}"
        ]
      }
    ],
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "@typescript-eslint/no-require-imports": "error"
  },
  parserOptions: {
    project: ["./packages/*/tsconfig.json"],
    warnOnUnsupportedTypeScriptVersion: false
  },
  overrides: [
    {
      files: ["**/*.spec.{ts,tsx}", "**/__mocks__/**/*"],
      env: {
        jest: true
      },
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "no-constant-condition": "off",
        "no-empty": "off",
        "no-await-in-loop": "off"
      }
    },
    {
      files: ["*.d.ts"],
      rules: {
        // Fix to /// imports in .d.ts
        "spaced-comment": ["error", "always", { markers: ["/"] }]
      }
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
        "@typescript-eslint/no-var-requires": "off"
      }
    }
  ]
};
