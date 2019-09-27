module.exports = {
  extends: [
    "ash-nazg/sauron-node"
  ],
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true
  },
  settings: {
    polyfills: [
      'console',
      'Promise'
    ]
  },
  overrides: [
    {
      files: ['**/*.html'],
      rules: {
        'import/unambiguous': 'off'
      }
    },
    // Our Markdown rules (and used for JSDoc examples as well, by way of
    //   our use of `matchingFileName` in conjunction with
    //   `jsdoc/check-examples` within `ash-nazg`)
    {
      files: ["**/*.md"],
      rules: {
        "eol-last": ["off"],
        "no-console": ["off"],
        "no-undef": ["off"],
        "no-unused-vars": ["warn"],
        "padded-blocks": ["off"],
        "import/unambiguous": ["off"],
        "import/no-unresolved": ["off"],
        "node/no-missing-import": ["off"],
        "no-multi-spaces": "off",
        "sonarjs/no-all-duplicated-branches": "off",
        "no-alert": "off",
        // Disable until may fix https://github.com/gajus/eslint-plugin-jsdoc/issues/211
        "indent": "off"
      }
    },
    {
      files: ["test/**"],
      rules: {
        "no-console": ["off"]
      }
    }
  ],
  rules: {
  }
};
