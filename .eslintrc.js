var OFF = 0,
  WARN = 1,
  ERROR = 2

module.exports = exports = {
  root: true,
  extends: "next/core-web-vitals",
  plugins: ["@tanstack/eslint-plugin-query"],
  rules: {
    eqeqeq: [WARN, "smart"],
    curly: [WARN, "all"],
    "capitalized-comments": [WARN, "always"],
    "no-else-return": [ERROR, { allowElseIf: false }],
    "no-lonely-if": [WARN],
    "no-unneeded-ternary": [ERROR, { defaultAssignment: false }],
  },
}
