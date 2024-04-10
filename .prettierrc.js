/** @type {import("prettier").Config} */
const config = {
  plugins: [
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-classnames",
    "prettier-plugin-merge",
  ],
  endingPosition: "absolute-with-indent",
  printWidth: 80,
  singleQuote: false,
  trailingComma: "es5",
  tabWidth: 2,
  semi: false,
  bracketSpacing: true,
  endOfLine: "lf",
}

module.exports = config
