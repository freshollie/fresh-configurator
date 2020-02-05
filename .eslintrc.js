module.exports = {
  plugins: ["react", "react-hooks", "@typescript-eslint", "prettier", "import"],
  extends: [
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier/react",
    "prettier/@typescript-eslint"
  ],

  rules: {
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
    "react/prop-types": ["off"]
  },
  parserOptions: {
    project: ["./packages/*/tsconfig.eslint.json"],
    createDefaultProgram: true,
    warnOnUnsupportedTypeScriptVersion: false
  }
};
