module.exports = {
  globals: {
    it: false,
    describe: false,
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: ["./spec/tsconfig.json"],
      },
      rules: {
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-extraneous-class": "off",
      }
    },
  ],
  rules: {
    "no-console": "off",
    "no-new-wrappers": "off",
  },
}
