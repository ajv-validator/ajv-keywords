module.exports = {
  globals: {
    it: false,
    describe: false,
  },
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: ["./tests/tsconfig.json"],
      },
    },
  ],
  rules: {
    "no-console": "off",
    "no-new-wrappers": "off",
  },
}
